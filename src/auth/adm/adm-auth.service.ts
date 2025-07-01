import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/features/email/email.service';
import { Adm } from 'src/shared/entities/adm.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AdmAuthService{
  constructor(
    @InjectRepository(Adm)
    private readonly admRepository: Repository<Adm>, 
    protected readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(createDto: any) {
    const processedDto = { ...createDto };
    
    let { email, password, role, name } = processedDto;

    if (!password || !role || !email) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }
    await this.validateEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    let userDto = { password: hashedPassword, email, role, name };
    try {
      const createdUser = await this.admRepository.save(userDto);
      await this.emailService.sendWelcomeEmailToAdmin(email, name);
      return { id: createdUser.id, email: createdUser.email };
    } catch (dbError) {
      throw new HttpException(
        'Erro ao registrar usuário no banco de dados.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  protected async validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('E-mail inválido');
    }
    const emailExists = await this.admRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new ConflictException('E-mail já cadastrado');
    }
  }

  public async validateUser(email:string, password:string) {
    const user = await this.admRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login( user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}

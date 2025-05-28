import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export abstract class BaseAuthService<T> {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly service: T,
  ) {}

  async register(createDto: any) {
    const { password, role, email, cpf, ...rest } = createDto;
  
    if (!password || !role || !email) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }
  
    try {
      if (role === 'consultant') {
        await this.validateCpf(cpf);
        await this.validateEmail(email);
      } else if (role === 'user' || role === 'adm') {
        await this.validateEmail(email);
      } else {
        throw new BadRequestException('Role inválido');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userDto = { ...rest, password: hashedPassword, email, role };
      return (this.service as any).create(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao registrar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  private async validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('E-mail inválido');
    }
    const emailExists = await (this.service as any).findByEmailforRegister(email);
    if (emailExists) {
      throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
    }
  }

  private async validateCpf(cpf: string) {
    if (!cpf || cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
      throw new BadRequestException('CPF inválido');
    }
  
    
    if (/^(\d)\1+$/.test(cpf)) {
      throw new BadRequestException('CPF inválido');
    }
  
   
    const calculateCheckDigit = (cpf: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(cpf[i]) * (factor - i);
      }
      const remainder = (total * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };
  
    const firstCheckDigit = calculateCheckDigit(cpf, 10);
    const secondCheckDigit = calculateCheckDigit(cpf, 11);
  
    if (
      firstCheckDigit !== parseInt(cpf[9]) ||
      secondCheckDigit !== parseInt(cpf[10])
    ) {
      throw new BadRequestException('CPF inválido');
    }
  
    const cpfExists = await (this.service as any).findByCpf(cpf);
    if (cpfExists) {
      throw new HttpException('CPF já cadastrado', HttpStatus.BAD_REQUEST);
    }
  }
  

  async validateUser(email: string, password: string) {
    const user = await (this.service as any).findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}

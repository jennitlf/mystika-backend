import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AwsS3Service } from 'src/features/aws-s3/aws-s3.service';
import { EmailService } from 'src/features/email/email.service';

@Injectable()
export abstract class BaseAuthService<T> {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly service: T,
    protected readonly awsS3Service: AwsS3Service,
    private readonly emailService: EmailService,
  ) {}

  async register(createDto: any, file?: Express.Multer.File) {
    const processedDto = { ...createDto };
    let { password, role, email, cpf, ...rest } = processedDto;

    if (email) {
      email = email.toLowerCase();
      processedDto.email = email;
    }

    if (cpf) {
      cpf = cpf.replace(/\D/g, ''); 
      processedDto.cpf = cpf; 
    }

    if (!password || !role || !email) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }

    try {
      if (role === 'consultant') {
        await this.validateCpf(cpf);
        await this.validateEmail(email);
        if (!file) {
            throw new BadRequestException('A imagem do consultor é obrigatória.');
        }
      } else if (role === 'user' || role === 'adm') {
        await this.validateEmail(email);
        if (file) {
            throw new BadRequestException('Apenas consultores podem enviar imagens.');
        }
      } else {
        throw new BadRequestException('Role inválido');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let userDto = { ...rest, password: hashedPassword, email, role, cpf: processedDto.cpf };
      let createdUser;

      try {
        createdUser = await (this.service as any).create(userDto);
      } catch (dbError) {
        throw new HttpException(
          'Erro ao registrar usuário no banco de dados.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (role === 'consultant' && file) {
        let publicImageUrl: string;
        try {
          publicImageUrl = await this.awsS3Service.uploadFile(
            file.buffer,      
            file.mimetype,   
            file.originalname,
          );
        } catch (uploadError) {
            console.error('Erro ao fazer upload da imagem para S3:', uploadError);
            publicImageUrl = createdUser.image_consultant; 
        }

        if (publicImageUrl && publicImageUrl !== createdUser.image_consultant) {
            try {
                await (this.service as any).update(createdUser.id, {
                    image_consultant: publicImageUrl,
                });
                createdUser.image_consultant = publicImageUrl;
            } catch (updateError) {
                console.error('Erro ao atualizar URL da imagem no banco após upload para S3:', updateError);
                throw new HttpException(
                    'Erro ao associar imagem ao usuário após upload. O usuário foi criado, mas a imagem pode estar incorreta.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
      }
      if (role === 'consultant') {
        const loginUrl = process.env.FRONTEND_CONSULTANT_LOGIN_URL || 'https://mystika.com/consultor/login';
        const specialtiesUrl = process.env.FRONTEND_CONSULTANT_SPECIALTIES_URL || 'https://mystika.com/consultor/especialidades';
        const paymentPlansUrl = process.env.FRONTEND_CONSULTANT_PAYMENT_PLANS_URL || 'https://mystika.com/consultor/planos-de-pagamento';

        await this.emailService.sendWelcomeEmailToConsultant(
          createdUser.email, 
          createdUser.name, 
          loginUrl, 
          specialtiesUrl, 
          paymentPlansUrl
        );
      } else {
        await this.emailService.sendWelcomeEmailToUser(
          createdUser.email, 
          createdUser.name
        );
      }
      // -----------------------------------------------------------

      return createdUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao registrar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async validateEmail(email: string) {
    const lowercasedEmail = email.toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowercasedEmail)) {
      throw new BadRequestException('E-mail inválido');
    }
    const emailExists = await (this.service as any).findByEmailforRegister(lowercasedEmail);
    if (emailExists) {
      throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
    }
  }

  protected async validateCpf(cpf: string) {
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

  public async validateUser(email: string, password: string) {
    const lowercasedEmail = email.toLowerCase();
    const user = await (this.service as any).findByEmail(lowercasedEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const decodedToken: any = this.jwtService.decode(accessToken);
    const expiresInSeconds = decodedToken.exp;
    const issuedAtSeconds = decodedToken.iat;
    const expiresInMs = expiresInSeconds * 1000;
    const issuedAtMs = issuedAtSeconds * 1000;
    return { 
      access_token: accessToken,
      expires_in: expiresInMs,
      issued_at: issuedAtMs,
    };
  }
}
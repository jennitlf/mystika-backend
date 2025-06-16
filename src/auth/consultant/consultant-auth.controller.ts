import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ConsultantAuthService } from './consultant-auth.service';
import { CreateConsultantDto } from 'src/shared/dtos/create-consultant.dto';

@Controller('auth/consultant')
export class ConsultantAuthController {
  constructor(private readonly consultantAuthService: ConsultantAuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image_consultant'))
  async register(
    @Req() req: Request,
    @Body() body: CreateConsultantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file && req.url.includes('consultant')) {
      throw new BadRequestException('A imagem do consultor é obrigatória.');
    }

    const role = req.url.includes('consultant')
      ? 'consultant'
      : req.url.includes('customer')
      ? 'user'
      : 'adm';

    if (role !== 'consultant') {
      if (file) {
        throw new BadRequestException('Apenas consultores podem enviar imagens.');
      }
    }

    const userDto = { ...body, role };

    return this.consultantAuthService.register(userDto, file);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.consultantAuthService.validateUser(
      body.email,
      body.password,
    );
    if (!user) {
      throw new Error('Usuário ou senha incorreta');
    }
    return this.consultantAuthService.login(user);
  }
}
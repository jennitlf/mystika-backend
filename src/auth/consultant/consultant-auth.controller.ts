import { Controller, Post, Body, Req } from '@nestjs/common';
import { ConsultantAuthService } from './consultant-auth.service';
import { CreateConsultantDto } from 'src/shared/dtos/create-consultant.dto';

@Controller('auth/consultant')
export class ConsultantAuthController {
  constructor(private readonly ConsultantAuthService: ConsultantAuthService) {}

  @Post('register')
  async register(@Req() req: Request, @Body() body: CreateConsultantDto) {
    const role = req.url.includes('consultant')
    ? 'consultant'
    : req.url.includes('customer')
    ? 'user'
    : 'adm';

    const userDto = { ...body, role };
    return this.ConsultantAuthService.register(userDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.ConsultantAuthService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Usuário ou senha incorreta');
    }
    return this.ConsultantAuthService.login(user);
  }
}
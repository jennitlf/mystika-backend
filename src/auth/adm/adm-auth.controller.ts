import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdmAuthService } from './adm-auth.service';


@Controller('auth')
export class AdmAuthController {
  constructor(private readonly admAuthService: AdmAuthService) {}

  @Post('register')
  create(@Body() body: any) {
    const role = "adm"
    const userDto = { ...body, role };
    return this.admAuthService.register(userDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.admAuthService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Usuário ou senha incorreta');
    }
    return this.admAuthService.login(user);
  }
}

import { Controller, Post, Body, Req } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';

@Controller('auth/customer')
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Post('register')
  async register(@Req() req: Request, @Body() body: CreateCustomerDto) {
    const role = req.url.includes('consultant')
    ? 'consultant'
    : req.url.includes('customer')
    ? 'user'
    : 'adm';

    const userDto = { ...body, role };
    return this.customerAuthService.register(userDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.customerAuthService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Usuário ou senha incorreta');
    }
    return this.customerAuthService.login(user);
  }
}
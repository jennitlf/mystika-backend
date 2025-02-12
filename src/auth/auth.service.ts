// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(authRegisterDto: AuthRegisterDto) {
    const { password, ...rest } = authRegisterDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDto = { ...rest, password: hashedPassword };
    return this.userService.create(userDto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }
}

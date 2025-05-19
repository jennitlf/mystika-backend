// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';
import { UserService } from 'src/features/customer/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createCustomerDto: CreateCustomerDto) {
    const { password, ...rest } = createCustomerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDto = { ...rest, password: hashedPassword };
    return this.userService.create(userDto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}

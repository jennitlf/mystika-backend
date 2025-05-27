import { Injectable } from '@nestjs/common';
import { BaseAuthService } from '../base-auth.service';
import { UserService } from 'src/features/customer/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomerAuthService extends BaseAuthService<UserService> {
  constructor(jwtService: JwtService, userService: UserService) {
    super(jwtService, userService);
  }
}
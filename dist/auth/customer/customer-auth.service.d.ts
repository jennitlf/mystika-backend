import { BaseAuthService } from '../base-auth.service';
import { UserService } from 'src/features/customer/user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class CustomerAuthService extends BaseAuthService<UserService> {
    constructor(jwtService: JwtService, userService: UserService);
}

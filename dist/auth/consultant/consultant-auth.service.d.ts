import { BaseAuthService } from '../base-auth.service';
import { ConsultantService } from '../../features/consultant/consultant/consultant.service';
import { JwtService } from '@nestjs/jwt';
export declare class ConsultantAuthService extends BaseAuthService<ConsultantService> {
    constructor(jwtService: JwtService, consultantService: ConsultantService);
}

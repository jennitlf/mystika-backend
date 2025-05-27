import { Injectable } from '@nestjs/common';
import { BaseAuthService } from '../base-auth.service';
import { ConsultantService } from '../../features/consultant/consultant/consultant.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ConsultantAuthService extends BaseAuthService<ConsultantService> {
  constructor(jwtService: JwtService, consultantService: ConsultantService) {
    super(jwtService, consultantService);
  }
}
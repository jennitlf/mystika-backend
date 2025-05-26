import { Module } from '@nestjs/common';
import { ConsultantSupportService } from './cosultant-support.service';
import { ConsultantSupportController } from './cosultant-support.controller';

@Module({
  controllers: [ConsultantSupportController],
  providers: [ConsultantSupportService],
})
export class ConsultantSupportModule {}

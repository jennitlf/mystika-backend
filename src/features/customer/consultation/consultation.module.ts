import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';
import { Customer } from 'src/shared/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, ConsultantSpecialty, Customer]),
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService],
})
export class ConsultationModule {}

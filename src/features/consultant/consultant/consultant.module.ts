import { Module } from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { ConsultantController } from './consultant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { Specialty } from 'src/shared/entities/specialty.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultant, Specialty, ConsultantSpecialty]),
  ],
  controllers: [ConsultantController],
  providers: [ConsultantService],
})
export class ConsultantModule {}

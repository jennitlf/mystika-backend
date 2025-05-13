import { Module } from '@nestjs/common';
import { ConsultantSpecialtyService } from './consultant-specialty.service';
import { ConsultantSpecialtyController } from './consultant-specialty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ ConsultantSpecialty ])],
  controllers: [ConsultantSpecialtyController],
  providers: [ConsultantSpecialtyService],
})
export class ConsultantSpecialtyModule {}

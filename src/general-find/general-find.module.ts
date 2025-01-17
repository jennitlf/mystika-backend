import { Module } from '@nestjs/common';
import { GeneralFindService } from './general-find.service';
import { GeneralFindController } from './general-find.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { Specialty } from 'src/shared/entities/specialty.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([Consultant, Specialty, ConsultantSpecialty])],
  controllers: [GeneralFindController],
  providers: [GeneralFindService],
})
export class GeneralFindModule {}

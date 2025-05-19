import { Module } from '@nestjs/common';
import { CosultantSupportService } from './cosultant-support.service';
import { CosultantSupportController } from './cosultant-support.controller';

@Module({
  controllers: [CosultantSupportController],
  providers: [CosultantSupportService],
})
export class CosultantSupportModule {}

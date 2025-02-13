import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costumer } from 'src/shared/entities/costumer.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Costumer])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

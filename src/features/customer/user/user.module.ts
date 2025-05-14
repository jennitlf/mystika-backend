import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { DecodeTokenMiddleware } from 'src/middlewares/decode-token.moddleware';

@Module({
  imports: [ TypeOrmModule.forFeature([Customer])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware) 
      .forRoutes(
        { path: 'user/:id', method: RequestMethod.GET},
        { path: 'user', method: RequestMethod.GET},
        { path: 'user/:id', method: RequestMethod.PUT},
        { path: 'user/:id', method: RequestMethod.DELETE}
      ); 
  }
}

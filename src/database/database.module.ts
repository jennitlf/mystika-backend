import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          url: isProduction ? configService.get<string>('DATABASE_URL') : undefined,
          host: !isProduction ? configService.get<string>('POSTGRES_HOST') : undefined,
          port: !isProduction ? parseInt(configService.get<string>('POSTGRES_PORT'), 10) : undefined,
          username: !isProduction ? configService.get<string>('POSTGRES_USER') : undefined,
          password: !isProduction ? configService.get<string>('POSTGRES_PASSWORD') : undefined,
          database: !isProduction ? configService.get<string>('DATABASE_NAME') : undefined,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

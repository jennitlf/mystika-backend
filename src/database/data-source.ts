import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {config } from 'dotenv';

config();

const configService = new ConfigService()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../shared/migrations/*{.ts,.js}'],
  synchronize: false,
});

console.log({
  user: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
});

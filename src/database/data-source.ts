import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();
const configService = new ConfigService();
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(isProduction
    ? {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
        username: process.env.POSTGRES_USER || configService.get<string>('POSTGRES_USER'),
        password: process.env.POSTGRES_PASSWORD || configService.get<string>('POSTGRES_PASSWORD'),
        database: process.env.DATABASE_NAME || configService.get<string>('DATABASE_NAME') || '',
      }),

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../shared/migrations/*{.ts,.js}'],
  synchronize: false,
});
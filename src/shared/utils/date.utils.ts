import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class DateUtilsService {
  constructor(private readonly configService: ConfigService) {}

  getZonedDate(date: Date = new Date()): Date {
    const timeZone = this.configService.get<string>('TIMEZONE', 'America/Sao_Paulo');
    return toZonedTime(date, timeZone);
  }
}
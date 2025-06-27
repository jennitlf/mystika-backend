import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class DateUtilsService {
  constructor(private readonly configService: ConfigService) {}

  
  getZonedDate(date: Date = new Date(), clientTimeZone?: string): Date {
    const timeZoneToUse =
      clientTimeZone || this.configService.get<string>('TIMEZONE', 'America/Sao_Paulo');
    return DateTime.fromJSDate(date, { zone: timeZoneToUse }).toJSDate();
  }

  
  getStartOfDayInZone(date: Date, clientTimeZone: string): Date {
    const timeZoneToUse =
      clientTimeZone || this.configService.get<string>('TIMEZONE', 'America/Sao_Paulo');
    return DateTime.fromJSDate(date, { zone: timeZoneToUse })
      .startOf('day')
      .toJSDate();
  }

  
  formatDysplayDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      const date = DateTime.utc(Number(year), Number(month), Number(day)).toJSDate();
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Erro ao formatar data:', dateString, e);
      return dateString;
    }
  }
}

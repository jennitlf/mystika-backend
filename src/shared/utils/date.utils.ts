import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class DateUtilsService {
  constructor(private readonly configService: ConfigService) {}

  
  getZonedDate(date: Date = new Date(), clientTimeZone?: string): Date {
    const timeZoneToUse = clientTimeZone || this.configService.get<string>('TIMEZONE', 'UTC');
    const zonedDate = DateTime.fromJSDate(date).setZone(timeZoneToUse);

    if (!zonedDate.isValid) {
      console.error(`Fuso horário inválido: ${timeZoneToUse}`);
      return date;
    }

    return zonedDate.toJSDate();
  }

  
  getStartOfDayInZone(date: Date, clientTimeZone: string): Date {
    const timeZoneToUse = clientTimeZone || this.configService.get<string>('TIMEZONE', 'UTC');
    const startOfDay = DateTime.fromJSDate(date).setZone(timeZoneToUse).startOf('day');

    if (!startOfDay.isValid) {
      console.error(`Fuso horário inválido: ${timeZoneToUse}`);
      return date;
    }

    return startOfDay.toJSDate();
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

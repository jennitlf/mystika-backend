import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class DateUtilsService {
  constructor(private readonly configService: ConfigService) {}

  
  getZonedDate(date: Date = new Date(), clientTimeZone?: string): Date {
    const timeZoneToUse = clientTimeZone || 'UTC';
    console.log(`Recebido: date=${date}, timeZone=${timeZoneToUse}`);
  
    const zonedDate = DateTime.fromJSDate(date, { zone: timeZoneToUse });
  
    if (!zonedDate.isValid) {
      console.error(`Fuso horário inválido ou erro na conversão: ${timeZoneToUse}`);
      return date;
    }
  
    console.log(`Convertido para ${timeZoneToUse}: ${zonedDate.toISO()}`);
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

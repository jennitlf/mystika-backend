import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { toDate, toZonedTime } from 'date-fns-tz';

@Injectable()
export class DateUtilsService {
  constructor(private readonly configService: ConfigService) {}

  getZonedDate(date: Date = new Date(), clientTimeZone?: string): Date {
    const timeZoneToUse = clientTimeZone || this.configService.get<string>(
      'TIMEZONE',
      'America/Sao_Paulo',
    );
    return toDate(date, { timeZone: timeZoneToUse });
  }

  getStartOfDayInZone(date: Date, clientTimeZone: string): Date {
    const timeZoneToUse = clientTimeZone || this.configService.get<string>(
      'TIMEZONE',
      'America/Sao_Paulo',
    );
    const zonedDate = toDate(date, { timeZone: timeZoneToUse });
    const startOfDayString = zonedDate.toISOString().split('T')[0];
    return toDate(new Date(`${startOfDayString}T00:00:00Z`), { timeZone: timeZoneToUse });
  }
  formatDysplayDate(dateString){
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-");
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return dateString;
    }
  }
}
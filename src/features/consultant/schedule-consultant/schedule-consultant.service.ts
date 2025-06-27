import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {  Repository, Equal, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ScheduleConsultant,
  ScheduleAvailabilityDto,
} from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from '../../../shared/utils/date.utils';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class ScheduleConsultantService {
  constructor(
    @InjectRepository(ScheduleConsultant)
    private readonly scheduleConsultantRepository: Repository<ScheduleConsultant>,
    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly dateUtilsService: DateUtilsService,
  ) {}

  private parseTime(time: string, baseDate: Date): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    console.log(`Tempo '${time}' analisado na data: ${date}`);
    return date;
  }
  
  private formatTime(date: Date, timeZone: string): string {
    const formatted = formatInTimeZone(date, timeZone, 'HH:mm'); // Usa o fuso horário passado
    console.log(`Data '${date}' formatada para o fuso horário '${timeZone}': ${formatted}`);
    return formatted;
  }
  
  private generateTimes(start: Date, end: Date, duration: number): Date[] {
    const times: Date[] = [];
    const currentTime = new Date(start);
    while (currentTime.getTime() + duration * 60000 <= end.getTime()) {
      times.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    console.log(`Horários gerados de ${start} a ${end} com duração de ${duration}:`, times);
    return times;
  }
  
  async getTimeslots(
    idConsultantSpecialty: number,
    timeZone: string,
    date?: string | null,
  ): Promise<ScheduleAvailabilityDto[]> {
    console.log(`getTimeslots chamado com idConsultantSpecialty: ${idConsultantSpecialty}, timeZone: ${timeZone}, date: ${date}`);
  
    const now = this.dateUtilsService.getZonedDate(new Date(), timeZone);
    console.log(`Hora atual no fuso horário do cliente (${timeZone}): ${now}`);
    const startOfToday = this.dateUtilsService.getStartOfDayInZone(now, timeZone);
    console.log(`Início do dia no fuso horário do cliente: ${startOfToday}`);
  
    const schedules = await this.scheduleConsultantRepository.find({
      where: {
        id_consultant_specialty: idConsultantSpecialty,
        ...(date && { date: Equal(new Date(date)) }),
      },
      relations: ['scheduleException', 'consultation', 'consultantSpecialty'],
    });
    console.log('Agendamentos obtidos:', schedules);
  
    return schedules
      .filter((schedule) => {
        const scheduleDate = this.dateUtilsService.getZonedDate(
          new Date(schedule.date_time_initial),
          timeZone,
        );
        console.log(`Filtrando agendamento: ${schedule.id}. Data do agendamento no fuso horário do cliente: ${scheduleDate}. Comparando com o início do dia: ${startOfToday}`);
        return scheduleDate >= startOfToday;
      })
      .map((schedule) => {
        const date_time_initial = this.dateUtilsService.getZonedDate(
          new Date(schedule.date_time_initial),
          timeZone,
        );
        const date_time_end = this.dateUtilsService.getZonedDate(
          new Date(schedule.date_time_end),
          timeZone,
        );
        console.log(`ID do agendamento: ${schedule.id}. Hora inicial: ${date_time_initial}, Hora final: ${date_time_end}`);
  
        let availableTimes = this.generateTimes(
          date_time_initial,
          date_time_end,
          schedule.consultantSpecialty.duration,
        );
        console.log(`Horários disponíveis após geração para o agendamento ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        const unavailableExceptionTimes = schedule.scheduleException
          .map((ex) => {
            const exceptionDateTimeInClientZone = this.dateUtilsService.getZonedDate(
              new Date(ex.unavailable_date_time),
              timeZone,
            );
            const formattedExceptionTime = exceptionDateTimeInClientZone.toDateString() === date_time_initial.toDateString()
              ? this.formatTime(exceptionDateTimeInClientZone, timeZone)
              : null;
            console.log(`Exceção: ${ex.id}. Hora da exceção no fuso horário do cliente: ${exceptionDateTimeInClientZone}. Formatado: ${formattedExceptionTime}`);
            return formattedExceptionTime;
          })
          .filter((time) => time !== null);
        console.log(`Horários de exceção indisponíveis para o agendamento ${schedule.id}:`, unavailableExceptionTimes);
  
        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !unavailableExceptionTimes.includes(this.formatTime(time, timeZone));
            console.log(`Filtrando horário ${this.formatTime(time, timeZone)} contra exceções. Está disponível: ${isAvailable}`);
            return isAvailable;
          },
        );
        console.log(`Horários disponíveis após filtrar exceções para o agendamento ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        if (date_time_initial.toDateString() === now.toDateString()) {
          availableTimes = availableTimes.filter((time) => {
            const isAfterNow = time > now;
            console.log(`Filtrando horário ${this.formatTime(time, timeZone)} contra hora atual (${this.formatTime(now, timeZone)}). É depois de agora: ${isAfterNow}`);
            return isAfterNow;
          });
          console.log(`Horários disponíveis após filtrar horários passados para o dia atual do agendamento ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
        }
  
        const bookedTimes = schedule.consultation
          .map((c) => {
            const consultationDateTimeInClientZone = this.dateUtilsService.getZonedDate(
              new Date(c.appoinment_date_time),
              timeZone,
            );
            const formattedBookedTime = consultationDateTimeInClientZone.toDateString() === date_time_initial.toDateString()
              ? this.formatTime(consultationDateTimeInClientZone, timeZone)
              : null;
            console.log(`Consulta: ${c.id}. Hora da consulta no fuso horário do cliente: ${consultationDateTimeInClientZone}. Formatado: ${formattedBookedTime}`);
            return formattedBookedTime;
          })
          .filter((time) => time !== null);
        console.log(`Horários agendados para o agendamento ${schedule.id}:`, bookedTimes);
  
        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !bookedTimes.includes(this.formatTime(time, timeZone));
            console.log(`Filtrando horário ${this.formatTime(time, timeZone)} contra horários agendados. Está disponível: ${isAvailable}`);
            return isAvailable;
          },
        );
        console.log(`Horários finais disponíveis para o agendamento ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        return {
          date: date_time_initial,
          available_times: availableTimes.map((time) => this.formatTime(time, timeZone)),
          schedule_id: schedule.id,
        };
      });
  }
  

  async createRecurring(createRecurringScheduleDto: any, timeZone: string) {
    console.log('createRecurring chamado com:', createRecurringScheduleDto, 'fuso horário:', timeZone);
    const {
      id_consultant_specialty,
      start_date,
      end_date,
      hour_initial,
      hour_end,
      status,
    } = createRecurringScheduleDto;
  
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    console.log(`Data de início fornecida: ${startDate}, data de término: ${endDate}`);
  
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if (diffInDays > 90) {
      throw new HttpException(
        'O intervalo máximo permitido é de 3 meses (aproximadamente 90 dias).',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const schedules = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateISO = date.toISOString().split('T')[0];
      console.log(`Processando data: ${dateISO}`);
  
      const localStartDateTimeString = `${dateISO}T${hour_initial}`;
      const localEndDateTimeString = `${dateISO}T${hour_end}`;
      console.log(`String de data/hora de início local: ${localStartDateTimeString}, String de data/hora de término local: ${localEndDateTimeString}`);
  
      const date_time_initial_obj = toZonedTime(localStartDateTimeString, timeZone);
      const date_time_end_obj = toZonedTime(localEndDateTimeString, timeZone);
      console.log(`Hora de início convertida (para armazenamento): ${date_time_initial_obj.toISOString()}`);
      console.log(`Hora de término convertida (para armazenamento): ${date_time_end_obj.toISOString()}`);
  
      const overlappingSchedule = await this.scheduleConsultantRepository.findOne({
        where: {
          id_consultant_specialty,
          date_time_initial: LessThanOrEqual(date_time_end_obj),
          date_time_end: MoreThanOrEqual(date_time_initial_obj),
        },
      });
      console.log(`Verificando sobreposição de agendamento para ${dateISO}. Agendamento sobreposto encontrado:`, overlappingSchedule ? overlappingSchedule.id : 'Nenhum');
  
      if (!overlappingSchedule) {
        schedules.push(
          this.scheduleConsultantRepository.create({
            id_consultant_specialty,
            date: dateISO,
            hour_initial,
            hour_end,
            date_time_initial: date_time_initial_obj.toISOString(),
            date_time_end: date_time_end_obj.toISOString(),
            status,
          }),
        );
        console.log(`Novo agendamento adicionado para ${dateISO}.`);
      } else {
        console.log(`Agendamento para ${dateISO} ignorado devido à sobreposição.`);
      }
    }
  
    if (schedules.length > 0) {
      console.log(`Salvando ${schedules.length} novos agendamentos.`);
      return this.scheduleConsultantRepository.save(schedules);
    }
  
    console.log('Nenhum novo agendamento foi criado; existem agendamentos sobrepostos.');
    throw new HttpException(
      'No new schedules were created; overlapping schedules exist.',
      HttpStatus.CONFLICT,
    );
  }
    

  async remove(id: string) {
    console.log(`Removendo agendamento do consultor com ID: ${id}`);
    const schedule_consultant = await this.scheduleConsultantRepository.findOne(
      {
        where: { id: +id },
      },
    );
    if (!schedule_consultant) {
      console.log(`Agendamento do consultor com ID: ${id} não encontrado.`);
      throw new NotFoundException(`schedule consultant id: ${id} not found`);
    }
    console.log(`Agendamento do consultor encontrado para remoção:`, schedule_consultant);
    return this.scheduleConsultantRepository.remove(schedule_consultant);
  }
}
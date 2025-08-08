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
import { DateTime } from 'luxon';

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
    return date;
  }
  
  private formatTime(date: Date, timeZone: string): string {
    const formatted = formatInTimeZone(date, timeZone, 'HH:mm');
    return formatted;
  }
  
  private generateTimes(start: Date, end: Date, duration: number): Date[] {
    const times: Date[] = [];
    const currentTime = new Date(start);
    while (currentTime.getTime() + duration * 60000 <= end.getTime()) {
      times.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return times;
  }
  
  async getTimeslots(
    idConsultantSpecialty: number,
    timeZone: string,
    date?: string | null,
  ): Promise<ScheduleAvailabilityDto[]> {
  
    const now = this.dateUtilsService.getZonedDate(new Date(), timeZone);
    const startOfToday = this.dateUtilsService.getStartOfDayInZone(now, timeZone);
  
    let query = this.scheduleConsultantRepository
      .createQueryBuilder('scheduleConsultant')
      .where('scheduleConsultant.id_consultant_specialty = :id', { id: idConsultantSpecialty })
      .leftJoinAndSelect('scheduleConsultant.scheduleException', 'scheduleException')
      .leftJoinAndSelect('scheduleConsultant.consultation', 'consultation')
      .leftJoinAndSelect('scheduleConsultant.consultantSpecialty', 'consultantSpecialty');

    if (date) {
      query = query.andWhere('scheduleConsultant.date = :date', { date });
    }

    const schedules = await query.getMany();
  
    return schedules
      .filter((schedule) => {
        const scheduleDate = this.dateUtilsService.getZonedDate(
          new Date(schedule.date_time_initial),
          timeZone,
        );
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
  
        let availableTimes = this.generateTimes(
          date_time_initial,
          date_time_end,
          schedule.consultantSpecialty.duration,
        );
  
        const unavailableExceptionTimes = schedule.scheduleException
          .map((ex) => {
            const exceptionDateTimeInClientZone = this.dateUtilsService.getZonedDate(
              new Date(ex.unavailable_date_time),
              timeZone,
            );
            const formattedExceptionTime = exceptionDateTimeInClientZone.toDateString() === date_time_initial.toDateString()
              ? this.formatTime(exceptionDateTimeInClientZone, timeZone)
              : null;
            return formattedExceptionTime;
          })
          .filter((time) => time !== null);

        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !unavailableExceptionTimes.includes(this.formatTime(time, timeZone));
            return isAvailable;
          },
        );
  
        if (date_time_initial.toDateString() === now.toDateString()) {
          availableTimes = availableTimes.filter((time) => {
            const isAfterNow = time > now;
            return isAfterNow;
          });
        }
  
        const bookedTimes = schedule.consultation
          .filter(c => c.status === 'confirmada')
          .map((c) => {
            const consultationDateTimeInClientZone = this.dateUtilsService.getZonedDate(
              new Date(c.appoinment_date_time),
              timeZone,
            );
            const formattedBookedTime = consultationDateTimeInClientZone.toDateString() === date_time_initial.toDateString()
              ? this.formatTime(consultationDateTimeInClientZone, timeZone)
              : null;
            return formattedBookedTime;
          })
          .filter((time) => time !== null);
  
        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !bookedTimes.includes(this.formatTime(time, timeZone));
            return isAvailable;
          },
        );
  
        return {
          date: date_time_initial,
          available_times: availableTimes.map((time) => this.formatTime(time, timeZone)),
          schedule_id: schedule.id,
        };
      });
  }



  async createRecurring(createRecurringScheduleDto: any, timeZone: string) {
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
  
      const localStartDateTimeString = `${dateISO}T${hour_initial}`;
      const localEndDateTimeString = `${dateISO}T${hour_end}`;
  
      const date_time_initial_obj = DateTime.fromISO(localStartDateTimeString, {
        zone: timeZone,
      }).toUTC().toJSDate();
      const date_time_end_obj = DateTime.fromISO(localEndDateTimeString, {
        zone: timeZone,
      }).toUTC().toJSDate();
  
      const overlappingSchedule = await this.scheduleConsultantRepository.findOne({
        where: {
          id_consultant_specialty,
          date_time_initial: LessThanOrEqual(date_time_end_obj),
          date_time_end: MoreThanOrEqual(date_time_initial_obj),
        },
      });
  
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
      } else {
      }
    }
  
    if (schedules.length > 0) {
      return this.scheduleConsultantRepository.save(schedules);
    }
  
    throw new HttpException(
      'No new schedules were created; overlapping schedules exist.',
      HttpStatus.CONFLICT,
    );
  }
    

  async remove(id: string) {
    const schedule_consultant = await this.scheduleConsultantRepository.findOne(
      {
        where: { id: +id },
      },
    );
    if (!schedule_consultant) {
      throw new NotFoundException(`schedule consultant id: ${id} not found`);
    }
    return this.scheduleConsultantRepository.remove(schedule_consultant);
  }
}
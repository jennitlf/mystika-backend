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
    console.log(`Parsed time ${time} into date: ${date}`);
    return date;
  }
  
  private formatTime(date: Date, timeZone: string): string {
    const formatted = formatInTimeZone(date, timeZone, 'HH:mm'); // Usa o fuso horário passado
    console.log(`Formatted date ${date} into time for timezone ${timeZone}: ${formatted}`);
    return formatted;
  }
  
  private generateTimes(start: Date, end: Date, duration: number): Date[] {
    const times: Date[] = [];
    const currentTime = new Date(start);
    while (currentTime.getTime() + duration * 60000 <= end.getTime()) {
      times.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    console.log(`Generated times from ${start} to ${end} with duration ${duration}:`, times);
    return times;
  }
  
  async getTimeslots(
    idConsultantSpecialty: number,
    timeZone: string,
    date?: string | null,
  ): Promise<ScheduleAvailabilityDto[]> {
    console.log(`getTimeslots called with idConsultantSpecialty: ${idConsultantSpecialty}, timeZone: ${timeZone}, date: ${date}`);
  
    const now = this.dateUtilsService.getZonedDate(new Date(), timeZone);
    console.log(`Current time in client's timezone (${timeZone}): ${now}`);
    const startOfToday = this.dateUtilsService.getStartOfDayInZone(now, timeZone);
    console.log(`Start of today in client's timezone: ${startOfToday}`);
  
    const schedules = await this.scheduleConsultantRepository.find({
      where: {
        id_consultant_specialty: idConsultantSpecialty,
        ...(date && { date: Equal(new Date(date)) }),
      },
      relations: ['scheduleException', 'consultation', 'consultantSpecialty'],
    });
    console.log('Fetched schedules:', schedules);
  
    return schedules
      .filter((schedule) => {
        const scheduleDate = this.dateUtilsService.getZonedDate(
          new Date(schedule.date_time_initial),
          timeZone,
        );
        console.log(`Filtering schedule: ${schedule.id}. Schedule date in client zone: ${scheduleDate}. Comparing with start of today: ${startOfToday}`);
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
        console.log(`Schedule ID: ${schedule.id}. Initial time: ${date_time_initial}, End time: ${date_time_end}`);
  
        let availableTimes = this.generateTimes(
          date_time_initial,
          date_time_end,
          schedule.consultantSpecialty.duration,
        );
        console.log(`Available times after generation for schedule ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        const unavailableExceptionTimes = schedule.scheduleException
          .map((ex) => {
            const exceptionDateTimeInClientZone = this.dateUtilsService.getZonedDate(
              new Date(ex.unavailable_date_time),
              timeZone,
            );
            const formattedExceptionTime = exceptionDateTimeInClientZone.toDateString() === date_time_initial.toDateString()
              ? this.formatTime(exceptionDateTimeInClientZone, timeZone)
              : null;
            console.log(`Exception: ${ex.id}. Exception time in client zone: ${exceptionDateTimeInClientZone}. Formatted: ${formattedExceptionTime}`);
            return formattedExceptionTime;
          })
          .filter((time) => time !== null);
        console.log(`Unavailable exception times for schedule ${schedule.id}:`, unavailableExceptionTimes);
  
        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !unavailableExceptionTimes.includes(this.formatTime(time, timeZone));
            console.log(`Filtering time ${this.formatTime(time, timeZone)} against exceptions. Is available: ${isAvailable}`);
            return isAvailable;
          },
        );
        console.log(`Available times after filtering exceptions for schedule ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        if (date_time_initial.toDateString() === now.toDateString()) {
          availableTimes = availableTimes.filter((time) => {
            const isAfterNow = time > now;
            console.log(`Filtering time ${this.formatTime(time, timeZone)} against current time (${this.formatTime(now, timeZone)}). Is after now: ${isAfterNow}`);
            return isAfterNow;
          });
          console.log(`Available times after filtering past times for current day for schedule ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
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
            console.log(`Consultation: ${c.id}. Consultation time in client zone: ${consultationDateTimeInClientZone}. Formatted: ${formattedBookedTime}`);
            return formattedBookedTime;
          })
          .filter((time) => time !== null);
        console.log(`Booked times for schedule ${schedule.id}:`, bookedTimes);
  
        availableTimes = availableTimes.filter(
          (time) => {
            const isAvailable = !bookedTimes.includes(this.formatTime(time, timeZone));
            console.log(`Filtering time ${this.formatTime(time, timeZone)} against booked times. Is available: ${isAvailable}`);
            return isAvailable;
          },
        );
        console.log(`Final available times for schedule ${schedule.id}:`, availableTimes.map(t => this.formatTime(t, timeZone)));
  
        return {
          date: date_time_initial,
          available_times: availableTimes.map((time) => this.formatTime(time, timeZone)),
          schedule_id: schedule.id,
        };
      });
  }
  

  async createRecurring(createRecurringScheduleDto: any, timeZone: string) {
    console.log('createRecurring called with:', createRecurringScheduleDto, 'timeZone:', timeZone);
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
    console.log(`Provided start date: ${startDate}, end date: ${endDate}`);
  
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
      console.log(`Processing date: ${dateISO}`);
  
      const localStartDateTimeString = `${dateISO}T${hour_initial}`;
      const localEndDateTimeString = `${dateISO}T${hour_end}`;
      console.log(`Local start datetime string: ${localStartDateTimeString}, Local end datetime string: ${localEndDateTimeString}`);
  
      const date_time_initial_obj = toZonedTime(localStartDateTimeString, timeZone);
      const date_time_end_obj = toZonedTime(localEndDateTimeString, timeZone);
      console.log(`Converted start time (for storage): ${date_time_initial_obj.toISOString()}`);
      console.log(`Converted end time (for storage): ${date_time_end_obj.toISOString()}`);
  
      const overlappingSchedule = await this.scheduleConsultantRepository.findOne({
        where: {
          id_consultant_specialty,
          date_time_initial: LessThanOrEqual(date_time_end_obj),
          date_time_end: MoreThanOrEqual(date_time_initial_obj),
        },
      });
      console.log(`Checking for overlapping schedule for ${dateISO}. Overlapping schedule found:`, overlappingSchedule ? overlappingSchedule.id : 'None');
  
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
        console.log(`Added new schedule for ${dateISO}.`);
      } else {
        console.log(`Skipped schedule for ${dateISO} due to overlap.`);
      }
    }
  
    if (schedules.length > 0) {
      console.log(`Saving ${schedules.length} new schedules.`);
      return this.scheduleConsultantRepository.save(schedules);
    }
  
    console.log('No new schedules were created due to existing overlaps.');
    throw new HttpException(
      'No new schedules were created; overlapping schedules exist.',
      HttpStatus.CONFLICT,
    );
  }
    

  async remove(id: string) {
    console.log(`Removing schedule consultant with ID: ${id}`);
    const schedule_consultant = await this.scheduleConsultantRepository.findOne(
      {
        where: { id: +id },
      },
    );
    if (!schedule_consultant) {
      console.log(`Schedule consultant with ID: ${id} not found.`);
      throw new NotFoundException(`schedule consultant id: ${id} not found`);
    }
    console.log(`Found schedule consultant to remove:`, schedule_consultant);
    return this.scheduleConsultantRepository.remove(schedule_consultant);
  }
}
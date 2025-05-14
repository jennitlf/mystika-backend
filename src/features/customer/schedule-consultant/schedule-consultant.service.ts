import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ScheduleConsultant,
  ScheduleAvailabilityDto,
} from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from '../../../shared/utils/date.utils';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { query } from 'express';

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

  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = this.dateUtilsService.getZonedDate();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private generateTimes(
    start: string,
    end: string,
    duration: number,
  ): string[] {
    const times = [];
    let currentTime = this.parseTime(start);
    const endTime = this.parseTime(end);
    while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
      times.push(this.formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    return times;
  }

  async getTimeslots(
    idConsultantSpecialty: number,
    date: string | null,
  ): Promise<ScheduleAvailabilityDto[]> {
    const scheduleDate = date
      ? this.dateUtilsService.getZonedDate(new Date(date + 'T00:00:00'))
      : null;
    const now = this.dateUtilsService.getZonedDate();
    now.setSeconds(0, 0);

    const schedules = await this.scheduleConsultantRepository.find({
      where: {
        id_consultant_specialty: idConsultantSpecialty,
        ...(scheduleDate && { date: scheduleDate }),
      },
      relations: ['scheduleException', 'consultantSpecialty'],
    });

    const validSchedules = schedules.filter((schedule) => {
      const schDt = this.dateUtilsService.getZonedDate(
        new Date(schedule.date + 'T00:00:00'),
      );
      return schDt >= now || schDt.toDateString() === now.toDateString();
    });

    const timeslots = await Promise.all(
      validSchedules.map(async (schedule) => {
        const {
          hour_initial,
          hour_end,
          date,
          scheduleException,
          consultantSpecialty,
          id,
        } = schedule;
        if (!consultantSpecialty) {
          throw new Error('ConsultantSpecialty não encontrado');
        }
        const { duration } = consultantSpecialty;
        const allTimes = this.generateTimes(hour_initial, hour_end, duration);

        const relevantExceptions = scheduleException.filter(
          (ex) =>
            ex.date_exception.toISOString().split('T')[0] ===
            this.dateUtilsService
              .getZonedDate(new Date(date + 'T00:00:00'))
              .toISOString()
              .split('T')[0],
        );
        const unavailableTimes = relevantExceptions.map((ex) =>
          this.formatTime(this.parseTime(ex.unavailable_time)),
        );
        const availableTimes = allTimes.filter(
          (time) => !unavailableTimes.includes(time),
        );

        const schDate = this.dateUtilsService.getZonedDate(
          new Date(date + 'T00:00:00'),
        );
        const filteredTimes =
          schDate.toDateString() === now.toDateString()
            ? availableTimes.filter((time) => this.parseTime(time) > now)
            : availableTimes;

        const scheduleDateISO = schDate.toISOString().split('T')[0];

        const consultations = await this.consultationRepository.find({
          where: {
            id_schedule_consultant: id,
            appoinment_date: Raw(
              (alias) => `DATE(${alias}) = '${scheduleDateISO}'`,
            ),
          },
        });

        const bookedTimes = consultations.map((consultation) =>
          consultation.appoinment_time.slice(0, 5),
        );

        const availableTimesAfterBooking = filteredTimes.filter(
          (time) => !bookedTimes.includes(time),
        );

        return {
          schedule_id: id,
          date,
          available_times: availableTimesAfterBooking,
        };
      }),
    );

    return timeslots;
  }

  async createRecurring(createRecurringScheduleDto: any) {
    const {
      id_consultant_specialty,
      start_date,
      end_date,
      days_of_week,
      hour_initial,
      hour_end,
      status,
    } = createRecurringScheduleDto;

    const startDate = this.dateUtilsService.getZonedDate(new Date(start_date));
    const endDate = this.dateUtilsService.getZonedDate(new Date(end_date));

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if (diffInDays > 90) {
      throw new HttpException(
        'O intervalo máximo permitido é de 3 meses (aproximadamente 90 dias).',
        HttpStatus.BAD_REQUEST,
      );
    }
    const schedules = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (days_of_week.includes(date.getDay())) {
        const scheduleDate = this.dateUtilsService.getZonedDate(
          new Date(date.toISOString().split('T')[0] + 'T00:00:00'),
        );
        const scheduleExists = await this.scheduleConsultantRepository.findOne({
          where: {
            id_consultant_specialty,
            date: scheduleDate,
            hour_initial,
            hour_end,
          },
        });

        if (!scheduleExists) {
          schedules.push(
            this.scheduleConsultantRepository.create({
              id_consultant_specialty,
              date: date.toISOString().split('T')[0],
              hour_initial,
              hour_end,
              status,
            }),
          );
        }
      }
    }

    if (schedules.length > 0) {
      return this.scheduleConsultantRepository.save(schedules);
    }

    throw new HttpException(
      'No new schedules were created; all dates already exist.',
      HttpStatus.CONFLICT,
    );
  }

  async create(createScheduleConsultant: any) {
    const { id_consultant_specialty, date, hour_initial, hour_end } =
      createScheduleConsultant;
    const verification = await this.scheduleConsultantRepository
      .createQueryBuilder('schedule')
      .where('schedule.id_consultant_specialty = :id_consultant_specialty', {
        id_consultant_specialty,
      })
      .andWhere('schedule.date = :date', { date })
      .andWhere(
        new Brackets((qb) => {
          qb.where('schedule.hour_initial = :hour_initial', {
            hour_initial,
          }).orWhere('schedule.hour_end = :hour_end', { hour_end });
        }),
      )
      .getOne();

    if (verification) {
      throw new HttpException(
        'Service already registered, enter a different day or time',
        HttpStatus.CONFLICT,
      );
    }
    const schedule_consultant = this.scheduleConsultantRepository.create(
      createScheduleConsultant,
    );
    return this.scheduleConsultantRepository.save(schedule_consultant);
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

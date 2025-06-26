import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { Repository } from 'typeorm';
import { ScheduleConsultantService } from '../schedule-consultant/schedule-consultant.service';
import { DateUtilsService } from 'src/shared/utils/date.utils';

@Injectable()
export class ScheduleExceptionService {
  constructor(
    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,
    @InjectRepository(ScheduleConsultant)
    private readonly scheduleConsultantRepository: Repository<ScheduleConsultant>,
    private readonly scheduleConsultantService: ScheduleConsultantService,
    private readonly dateUtilsService: DateUtilsService,
  ) {}

  async create(timeZone: string, createScheduleExceptionDto: any) {
    let timeLots = null;
    
    const date = createScheduleExceptionDto.unavailable_date_time.split('T')[0];
    const query = this.scheduleConsultantRepository
    .createQueryBuilder('scheduleConsultant')
    .where('scheduleConsultant.id = :id_schedule_consultant', {id: createScheduleExceptionDto.id_schedule_consultant})
    .innerJoin('scheduleConsultant.consultantSpecialty', 'consultantSpecialty')
    .select([
      'scheduleConsultant.id',
      'consultantSpecialty.id',
    ])
    const schedule = await query.getMany();
    if (!schedule || schedule.length === 0) {
      throw new NotFoundException(
        `Schedule consultant with id ${createScheduleExceptionDto.id_schedule_consultant} not found.`,
      );
    }
    if (schedule.some(s => s.consultantSpecialty && s.consultantSpecialty.id)) {
      const consultantSpecialtyId = schedule.find(
        s => s.consultantSpecialty && s.consultantSpecialty.id
      )?.consultantSpecialty.id;

      if (consultantSpecialtyId) {
          timeLots = await this.scheduleConsultantService.getTimeslots(
          consultantSpecialtyId,
          timeZone,
          date
        );
      }
    }
    const scheduleExceptionExists = await this.scheduleExceptionRepository.findOne({
      where: {
        unavailable_date_time: new Date(this.dateUtilsService.getZonedDate(
        new Date(createScheduleExceptionDto.unavailable_date_time),
        timeZone,
      ).toISOString())
      }
    })
    if (scheduleExceptionExists) {
      throw new HttpException(
        `Schedule exception already exists for date ${createScheduleExceptionDto.unavailable_date_time}.`,
      HttpStatus.CONFLICT);
    }
    if (!timeLots || timeLots.length === 0) {
      throw new NotFoundException(
        `No available timeslots found for consultant specialty id ${createScheduleExceptionDto.id_schedule_consultant}.`,
      );
    }
    const availableTimes = timeLots.flatMap((lot) => lot.available_times);
    const isUnavailableValid = availableTimes.includes(
    createScheduleExceptionDto.unavailable_time,
    );
    if (!isUnavailableValid) {
      throw new NotFoundException(
        `Unavailable time ${createScheduleExceptionDto.unavailable_time} not found in the available time slots. 
        Check if the time you want to make unavailable is already scheduled for consultation, if so, 
        it is not possible to make an already scheduled time unavailable.`,
      );
    }
    const dateExceptionLocal = this.dateUtilsService.getZonedDate(
      new Date(createScheduleExceptionDto.unavailable_date_time),
      timeZone,
    );
    
    const schedule_exception = this.scheduleExceptionRepository.create({
      id_schedule_consultant: createScheduleExceptionDto.id_schedule_consultant,
      date_exception: dateExceptionLocal,
      unavailable_time: createScheduleExceptionDto.unavailable_time,
      unavailable_date_time: dateExceptionLocal.toISOString(),
      reason: createScheduleExceptionDto.reason,
      
    });
    return this.scheduleExceptionRepository.save(schedule_exception);
  }

  async findAll(filters: { idScheduleConsultant?: number }) {
    const { idScheduleConsultant } = filters;

    const query = this.scheduleExceptionRepository
      .createQueryBuilder('scheduleException')
      .innerJoinAndSelect(
        'scheduleException.scheduleConsultant',
        'scheduleConsultant',
      );

    if (idScheduleConsultant)
      query.andWhere('scheduleConsultant.id = :idScheduleConsultant', {
        idScheduleConsultant,
      });

    return query.getMany();
  }

  async remove(id: number) {
    const scheduleException = await this.scheduleExceptionRepository.findOne({
      where: { id },
    })
    if (!scheduleException) {
      throw new NotFoundException(`Schedule exception with id ${id} not found.`);
    }
    
    return this.scheduleExceptionRepository.remove(scheduleException);
  }
}

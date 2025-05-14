import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleExceptionService {
  constructor(
    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,

    @InjectRepository(ScheduleConsultant)
    private readonly scheduleConsultantRepository: Repository<ScheduleConsultant>,
  ) {}

  async create(createScheduleExceptionDto: any) {
    const scheduleConsultantValid =
      await this.scheduleConsultantRepository.findOne({
        where: { id: +createScheduleExceptionDto.id_schedule_consultant },
      });
    if (!scheduleConsultantValid) {
      throw new NotFoundException(
        `schedule consultant id: ${createScheduleExceptionDto.id_schedule_consultant} not found, enter a valid id`,
      );
    }
    const schedule_exception = this.scheduleExceptionRepository.create(
      createScheduleExceptionDto,
    );
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

  findOne(id: number) {
    return `This action returns a #${id} scheduleException`;
  }

  update(id: number, updateScheduleExceptionDto: any) {
    return `This action updates a #${id} scheduleException`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleException`;
  }
}

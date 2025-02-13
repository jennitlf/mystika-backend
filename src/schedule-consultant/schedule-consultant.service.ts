import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';

@Injectable()
export class ScheduleConsultantService {

  constructor(

    @InjectRepository(ScheduleConsultant)
    private readonly scheduleConsultantRepository: Repository<ScheduleConsultant>,

    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>

  ){}

  create(createScheduleConsultantDto: any) {
    return 'This action adds a new scheduleConsultant';
  }

  findAll() {
    return this.scheduleConsultantRepository.find();
  }

  async findOne(id: string) {
    const scheduleConsutant = await this.scheduleConsultantRepository.findOne({
      where: {id: +id}
    })

    if(!scheduleConsutant){
      throw new NotFoundException(`Schedule not found`)
    }
    return scheduleConsutant;
  }

  async update(id: number, updateScheduleDto: any) {
    const scheduleConsutant = await this.scheduleConsultantRepository.preload({
      ...updateScheduleDto,
      id: +id
    })
    return this.scheduleConsultantRepository.save(scheduleConsutant);
  }

  async remove(id: number) {
    const scheduleConsultant = await this.scheduleConsultantRepository.findOne({where: {id: +id}})
    if(!scheduleConsultant){
      throw new NotFoundException('Schedule not found')
    }
    return this.scheduleConsultantRepository.remove(scheduleConsultant);
  }
}

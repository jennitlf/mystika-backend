import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleConsultant, ScheduleAvailabilityDto } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from '../shared/utils/date.utils';

@Injectable()
export class ScheduleConsultantService {

  constructor(

    @InjectRepository(ScheduleConsultant)
    private readonly scheduleConsultantRepository: Repository<ScheduleConsultant>,

    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,

    private readonly dateUtilsService: DateUtilsService

  ){}

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

  private generateTimes(start: string, end: string, duration: number): string[] {
    const times = [];
    let currentTime = this.parseTime(start);
    const endTime = this.parseTime(end);
  
    while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
      times.push(this.formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    
    return times;
  }

  async getTimeslots(idConsultantSpecialty: number, date: string | null): Promise<ScheduleAvailabilityDto[]> {
    const scheduleDate = date ? new Date(date + 'T00:00:00') : null;
    const now = this.dateUtilsService.getZonedDate(); 
    
    now.setSeconds(0, 0); // Normalizar para evitar problemas com milissegundos

    const schedules = await this.scheduleConsultantRepository.find({
        where: {
            id_consultant_specialty: idConsultantSpecialty,
            ...(scheduleDate && { date: scheduleDate }),
        },
        relations: ['scheduleException', 'consultantSpecialty'],
    });

    // Filtrar as datas anteriores ao dia atual
    const validSchedules = schedules.filter((schedule) => {
        const scheduleDate = this.dateUtilsService.getZonedDate(new Date(schedule.date + 'T00:00:00'));
        return scheduleDate >= now || scheduleDate.toDateString() === now.toDateString();
    });

    const timeslots = validSchedules.map((schedule) => {
        
        const { hour_initial, hour_end, date, scheduleException, consultantSpecialty } = schedule;
        if (!consultantSpecialty) {
            throw new Error('ConsultantSpecialty não encontrado');
        }
        const { duration } = consultantSpecialty;
        const allTimes = this.generateTimes(hour_initial, hour_end, duration);
        const relevantExceptions = scheduleException.filter(
            (ex) => ex.date_exception.toISOString().split('T')[0] === this.dateUtilsService.getZonedDate(new Date(date + 'T00:00:00')).toISOString().split('T')[0]
        );
        const unavailableTimes = relevantExceptions.map((ex) => this.formatTime(this.parseTime(ex.unavaiable_time)));
        const availableTimes = allTimes.filter((time) => !unavailableTimes.includes(time));
  
        // Filtrar horários anteriores ao momento atual, se a data for hoje
        const filteredTimes = this.dateUtilsService.getZonedDate(new Date(date + 'T00:00:00')).toDateString() === now.toDateString()
        ? availableTimes.filter((time) => this.parseTime(time) > now)
        : availableTimes;
        
        return {
            date,
            available_times: filteredTimes,
        };
    });

    return timeslots;
  }



async create (createScheduleConsultant: any) {  
  const { id_consultant_specialty, date, hour_initial, hour_end } = createScheduleConsultant;
  const verification = await this.scheduleConsultantRepository
    .createQueryBuilder('schedule')
    .where('schedule.id_consultant_specialty = :id_consultant_specialty', { id_consultant_specialty })
    .andWhere('schedule.date = :date', { date })
    .andWhere(
      new Brackets(qb => {
        qb.where('schedule.hour_initial = :hour_initial', { hour_initial })
          .orWhere('schedule.hour_end = :hour_end', { hour_end });
      }),
    )
    .getOne();

  if (verification) {
    throw new HttpException(
      'Service already registered, enter a different day or time',
      HttpStatus.CONFLICT,
    );
  }
  const schedule_consultant = this.scheduleConsultantRepository.create(createScheduleConsultant)
  return this.scheduleConsultantRepository.save(schedule_consultant)
}


async remove (id: string) {
  const schedule_consultant = await this.scheduleConsultantRepository.findOne({
    where: {id: +id}
  })
  if (!schedule_consultant){
    throw new NotFoundException(`schedule consultant id: ${id} not found`)
  }

  return this.scheduleConsultantRepository.remove(schedule_consultant);
}

}

import { Repository } from 'typeorm';
import { ScheduleConsultant, ScheduleAvailabilityDto } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { DateUtilsService } from '../../../shared/utils/date.utils';
import { Consultation } from 'src/shared/entities/consultation.entity';
export declare class ScheduleConsultantService {
    private readonly scheduleConsultantRepository;
    private readonly scheduleExceptionRepository;
    private readonly consultationRepository;
    private readonly dateUtilsService;
    constructor(scheduleConsultantRepository: Repository<ScheduleConsultant>, scheduleExceptionRepository: Repository<ScheduleException>, consultationRepository: Repository<Consultation>, dateUtilsService: DateUtilsService);
    private parseTime;
    private formatTime;
    private generateTimes;
    getTimeslots(idConsultantSpecialty: number, date: string | null): Promise<ScheduleAvailabilityDto[]>;
    createRecurring(createRecurringScheduleDto: any): Promise<any[]>;
    create(createScheduleConsultant: any): Promise<ScheduleConsultant[]>;
    remove(id: string): Promise<ScheduleConsultant>;
}

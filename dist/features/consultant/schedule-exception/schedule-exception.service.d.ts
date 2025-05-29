import { ScheduleConsultant } from 'src/shared/entities/schedule_consultant.entity';
import { ScheduleException } from 'src/shared/entities/schedule_exception.entity';
import { Repository } from 'typeorm';
export declare class ScheduleExceptionService {
    private readonly scheduleExceptionRepository;
    private readonly scheduleConsultantRepository;
    constructor(scheduleExceptionRepository: Repository<ScheduleException>, scheduleConsultantRepository: Repository<ScheduleConsultant>);
    create(createScheduleExceptionDto: any): Promise<ScheduleException[]>;
    findAll(filters: {
        idScheduleConsultant?: number;
    }): Promise<ScheduleException[]>;
    findOne(id: number): string;
    update(id: number, updateScheduleExceptionDto: any): string;
    remove(id: number): string;
}

import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from 'src/shared/dtos/create-schedule-consultant.dto';
import { CreateScheduleRecurringDto } from 'src/shared/dtos/create-schedule-recurring.dto';
export declare class ScheduleConsultantController {
    private readonly scheduleConsultantService;
    constructor(scheduleConsultantService: ScheduleConsultantService);
    getTimeslots(idConsultantSpecialty: number, date?: string): Promise<import("../../../shared/entities/schedule_consultant.entity").ScheduleAvailabilityDto[]>;
    create(createScheduleConsultantDto: CreateScheduleConsultantDto): Promise<import("../../../shared/entities/schedule_consultant.entity").ScheduleConsultant[]>;
    createRecurring(createRecurringScheduleDto: CreateScheduleRecurringDto): Promise<any[]>;
    remove(id: string): Promise<import("../../../shared/entities/schedule_consultant.entity").ScheduleConsultant>;
}

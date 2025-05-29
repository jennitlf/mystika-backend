import { ScheduleExceptionService } from './schedule-exception.service';
import CreateScheduleExceptionDto from 'src/shared/dtos/create-schedule-exception.dto';
export declare class ScheduleExceptionController {
    private readonly scheduleExceptionService;
    constructor(scheduleExceptionService: ScheduleExceptionService);
    create(createScheduleExceptionDto: CreateScheduleExceptionDto): Promise<import("../../../shared/entities/schedule_exception.entity").ScheduleException[]>;
    findAll(idScheduleConsultant?: number): Promise<import("../../../shared/entities/schedule_exception.entity").ScheduleException[]>;
    findOne(id: string): string;
    update(id: string, updateScheduleExceptionDto: any): string;
    remove(id: string): string;
}

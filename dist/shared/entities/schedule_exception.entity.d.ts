import { ScheduleConsultant } from './schedule_consultant.entity';
export declare class ScheduleException {
    id: number;
    id_schedule_consultant: number;
    date_exception: Date;
    day_week: number;
    unavailable_time: string;
    reason: string;
    scheduleConsultant: ScheduleConsultant;
}

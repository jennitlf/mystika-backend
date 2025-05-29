import { ConsultantSpecialty } from './consultant_specialty.entity';
import { ScheduleException } from './schedule_exception.entity';
import { Consultation } from './consultation.entity';
export declare class ScheduleConsultant {
    id: number;
    id_consultant_specialty: number;
    date: Date;
    day_week: number;
    hour_initial: string;
    hour_end: string;
    status: string;
    consultantSpecialty: ConsultantSpecialty;
    scheduleException: ScheduleException[];
    consultation: Consultation[];
}
export declare class ScheduleAvailabilityDto {
    readonly date: Date;
    readonly available_times: string[];
}

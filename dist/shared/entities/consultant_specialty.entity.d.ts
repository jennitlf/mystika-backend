import { Consultant } from './consultant.entity';
import { Specialty } from './specialty.entity';
import { ScheduleConsultant } from './schedule_consultant.entity';
import { Consultation } from './consultation.entity';
export declare class ConsultantSpecialty {
    id: number;
    id_consultant: number;
    id_specialty: number;
    duration: number;
    value_per_duration: number;
    created_at: Date;
    updated_at: Date;
    consultant: Consultant;
    specialty: Specialty;
    scheduleConsultant: ScheduleConsultant[];
    consultation: Consultation[];
}

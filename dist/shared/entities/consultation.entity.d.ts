import { Customer } from './customer.entity';
import { ScheduleConsultant } from './schedule_consultant.entity';
export declare class Consultation {
    id: number;
    id_customer: number;
    id_schedule_consultant: number;
    appoinment_date: Date;
    appoinment_time: string;
    status: string;
    attended: string;
    created_at: Date;
    updated_at: Date;
    customer: Customer;
    scheduleConsultant: ScheduleConsultant;
}

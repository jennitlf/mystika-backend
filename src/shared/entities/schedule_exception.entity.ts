import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ScheduleConsultant } from "./schedule_consultant.entity";

@Entity('schedule_exception')
export class ScheduleException{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_schedule_consultant: number;

    @Column()
    date_exception: Date;

    @Column()
    day_week: number;

    @Column()
    unavaiable_time: string;

    @Column()
    reason: string;

    @ManyToOne(()=>ScheduleConsultant, (scheduleConsultant) => scheduleConsultant.scheduleException)
    @JoinColumn({name: 'id_schedule_consultant'})
    scheduleConsultant: ScheduleConsultant;
    
}
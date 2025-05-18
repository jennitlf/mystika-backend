import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScheduleConsultant } from './schedule_consultant.entity';

@Entity('schedule_exception')
export class ScheduleException {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'id_schedule_consultant',
    nullable: false,
    type: 'int',
  })
  id_schedule_consultant: number;

  @Column({
    name: 'date_exception',
    type: 'date',
    nullable: false,
  })
  date_exception: Date;

  @Column({
    name: 'day_week',
    type: 'int',
    nullable: false,
  })
  day_week: number;

  @Column({
    name: 'unavailable_time',
    type: 'time',
    nullable: false,
  })
  unavailable_time: string;

  @Column({
    name: 'reason',
    type: 'varchar',
    length: 45,
  })
  reason: string;

  @ManyToOne(
    () => ScheduleConsultant,
    (scheduleConsultant) => scheduleConsultant.scheduleException,
  )
  @JoinColumn({ name: 'id_schedule_consultant' })
  scheduleConsultant: ScheduleConsultant;
}

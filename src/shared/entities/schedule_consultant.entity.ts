import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ConsultantSpecialty } from './consultant_specialty.entity';
import { ScheduleException } from './schedule_exception.entity';
import { Consultation } from './consultation.entity';

@Entity('schedule_consultant')
export class ScheduleConsultant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_consultant_specialty', type: 'int', nullable: false })
  id_consultant_specialty: number;

  @Column({ name: 'date', type: 'date', nullable: false })
  date: Date;

  @Column({ name: 'hour_initial', type: 'time', nullable: false })
  hour_initial: string;

  @Column({ name: 'hour_end', type: 'time', nullable: false })
  hour_end: string;

  @Column({ name: 'date_time_initial', type: 'timestamp', nullable: false })
  date_time_initial: Date;

  @Column({ name: 'date_time_end', type: 'timestamp', nullable: false })
  date_time_end: Date;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    default: 'disponível',
  })
  status: string;

  @ManyToOne(
    () => ConsultantSpecialty,
    (consultantSpecialty) => consultantSpecialty.scheduleConsultant,
  )
  @JoinColumn({ name: 'id_consultant_specialty' })
  consultantSpecialty: ConsultantSpecialty;

  @OneToMany(
    () => ScheduleException,
    (scheduleException) => scheduleException.scheduleConsultant,
  )
  scheduleException: ScheduleException[];

  @OneToMany(
    () => Consultation,
    (consultation) => consultation.scheduleConsultant,
  )
  consultation: Consultation[];
}

export class ScheduleAvailabilityDto {
  readonly date: Date;
  readonly available_times: string[];
  readonly schedule_id: number;
}

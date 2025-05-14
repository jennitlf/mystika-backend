import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { ConsultantSpecialty } from './consultant_specialty.entity';
import { ScheduleConsultant } from './schedule_consultant.entity';

@Entity('consultation')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_customer', type: 'int', nullable: false })
  id_customer: number;

  @Column({ name: 'id_consultant_specialty', type: 'int', nullable: false })
  id_consultant_specialty: number;

  @Column({ name: 'id_schedule_consultant', type: 'int', nullable: false })
  id_schedule_consultant: number;

  @Column({ name: 'appoinment_time', type: 'time', nullable: false })
  appoinment_time: string;

  @Column({ name: 'appoinment_data', type: 'date', nullable: false })
  appoinment_date: Date;

  @Column({ name: 'status', type: 'varchar', nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.consultation)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  @ManyToOne(
    () => ConsultantSpecialty,
    (consultant_specialty) => consultant_specialty.consultation,
  )
  @JoinColumn({ name: 'id_consultant_specialty' })
  consultantSpecialty: ConsultantSpecialty;

  @ManyToOne(
    () => ScheduleConsultant,
    (scheduleConsultant) => scheduleConsultant.consultation,
  )
  @JoinColumn({ name: 'id_schedule_consultant' })
  scheduleConsultant: ScheduleConsultant;
}

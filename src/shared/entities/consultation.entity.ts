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
import { ScheduleConsultant } from './schedule_consultant.entity';

@Entity('consultation')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_customer', type: 'int', nullable: false })
  id_customer: number;

  @Column({ name: 'id_schedule_consultant', type: 'int', nullable: false })
  id_schedule_consultant: number;

  @Column({ name: 'appoinment_date', type: 'time', nullable: false })
  appoinment_date: Date;

  @Column({ name: 'appoinment_time', type: 'time', nullable: false })
  appoinment_time: string;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: true,
    default: 'pending',
  })
  status: string;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: true,
    default: 'pending',
    length: 3,
  })
  attended: string;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.consultation)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  @ManyToOne(
    () => ScheduleConsultant,
    (scheduleConsultant) => scheduleConsultant.consultation,
  )
  @JoinColumn({ name: 'id_schedule_consultant' })
  scheduleConsultant: ScheduleConsultant;
}

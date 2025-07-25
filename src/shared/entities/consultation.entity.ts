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

  @Column({
    name: 'id_customer',
    type: 'int',
    nullable: false,
    default: 0,
  })
  id_customer: number;

  @Column({
    name: 'id_schedule_consultant',
    type: 'int',
    nullable: false,
    default: 0,
  })
  id_schedule_consultant: number;

  @Column({
    name: 'appoinment_date',
    type: 'date',
    nullable: false,
    default: () => `'2025-01-01'`,
  })
  appoinment_date: Date;

  @Column({
    name: 'appoinment_time',
    type: 'time',
    nullable: false,
    default: () => `'12:00:00'`,
  })
  appoinment_time: string;

  @Column({
    name: 'appoinment_date_time',
    type: 'timestamp',
    nullable: true,
  })
  appoinment_date_time: Date;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: true,
    length: '15',
    default: 'pendente',
  })
  status: string;

  @Column({
    name: 'attended',
    type: 'varchar',
    nullable: true,
    default: 'pendente',
    length: 9,
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

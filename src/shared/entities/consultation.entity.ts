import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { ScheduleConsultant } from './schedule_consultant.entity';
import { Payment } from './payments.entity';

export enum ConsultationStatus {
  PENDING_PAYMENT = 'pendente_pagamento', //responsabilidade do pagamento
  CONFIRMED = 'confirmada',               //responsabilidade do pagamento
  COMPLETED = 'realizada',                //responsabilidade do consultor, cliente e prazo maior que data da consulta
  PAYMENT_FAILURE = 'falha_no_pagamento', //responsabilidade do pagamento
  CANCELED = 'cancelada',                 //responsabilidade do consultor, cliente
}

@Unique(['id_customer', 'id_schedule_consultant', 'appoinment_date_time'])
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
    enum: ConsultationStatus,
    nullable: true,
    length: '18',
    default: ConsultationStatus.PENDING_PAYMENT,
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

  @OneToMany(
    () => Payment,
    (payment) => payment.consultation,
  )
  payments: Payment[];
}
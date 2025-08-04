import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  IN_PROCESS = 'in_process',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  CHARGEBACK = 'chargeback',
  authorized = 'authorized',
  OTHER = 'outro',
}

export enum PaymentMethodType {
  CARD = 'card',
  BOLETO = 'boleto',
  PIX = 'pix',
  OTHER = 'other',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'consultation_id',
    type: 'int',
    nullable: true,
  })
  consultation_id: number;

  @ManyToOne(() => Consultation, (consultation) => consultation.payments)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;

  @Column({
    name: 'mercadopago_payment_id',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  mercadopagoPaymentId: string;

  @Column({
    name: 'mercadopago_status_detail',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mercadopagoStatusDetail: string;

  @Column({
    name: 'mercadopago_json_response',
    type: 'jsonb',
    nullable: true,
  })
  mercadopagoJsonResponse: object;

  @Column({
    name: 'amount_paid',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amountPaid: number;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
    default: 'BRL',
    nullable: false,
  })
  currency: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    nullable: false,
  })
  status: PaymentStatus;

  
  @Column({
    name: 'status_updated_at',
    type: 'timestamp',
    nullable: true,
  })
  statusUpdatedAt: Date;
  

  @Column({
    name: 'payment_date',
    type: 'timestamp',
    nullable: true,
  })
  paymentDate: Date;

  @Column({
    name: 'payment_method_type',
    type: 'enum',
    enum: PaymentMethodType,
    nullable: false,
  })
  paymentMethodType: PaymentMethodType;

  @Column({
    name: 'card_last_4',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  cardLast4: string;

  @Column({
    name: 'card_brand',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cardBrand: string;

  @Column({
    name: 'card_exp_month',
    type: 'int',
    nullable: true,
  })
  cardExpMonth: number;

  @Column({
    name: 'card_exp_year',
    type: 'int',
    nullable: true,
  })
  cardExpYear: number;

  @Column({
    name: 'pix_code',
    type: 'text',
    nullable: true,
  })
  pixCode: string;

  @Column({
    name: 'pix_qr_code_url',
    type: 'varchar',
    length: 5000,
    nullable: true,
  })
  pixQrCodeUrl: string;

  @Column({
    name: 'boleto_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  boletoUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
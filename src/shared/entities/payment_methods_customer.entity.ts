import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Customer } from './customer.entity';
  
  @Entity('payment_methods_customer')
  export class PaymentMethodsCustomer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      name: 'customer_id',
      nullable: false,
      type: 'int',
    })
    customer_id: number;
  
    @Column({
      name: 'mercadopago_payment_method_token',
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    })
    mercadopagoPaymentMethodToken: string;
  
    @Column({
      name: 'last_4',
      type: 'varchar',
      nullable: false,
      length: 4,
    })
    last_4: string;
  
    @Column({
      name: 'brand',
      type: 'varchar',
      nullable: false,
      length: 50,
    })
    brand: string;
  
    @Column({
      name: 'exp_month',
      type: 'int',
      nullable: false,
    })
    exp_month: number;
  
    @Column({
      name: 'exp_year',
      type: 'int',
      nullable: false,
    })
    exp_year: number;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    @ManyToOne(() => Customer, (customer) => customer.paymentMethods)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
  }
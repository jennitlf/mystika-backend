import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConsultantSpecialty } from './consultant_specialty.entity';
import { ConsultantSupport } from './consultant_support.entity';

@Entity('consultant')
export class Consultant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    type: 'varchar',
    length: 60,
    default: 'NaN',
  })
  name: string;

  @Column({
    name: 'cpf',
    nullable: false,
    type: 'varchar',
    length: 11,
    default: 'NaN',
  })
  cpf: string;

  @Column({
    name: 'phone',
    nullable: false,
    type: 'varchar',
    length: 15,
    default: 'NaN',
  })
  phone: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 60,
    default: 'NaN',
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    type: 'varchar',
    length: 300,
    default: 'NaN',
  })
  password: string;

  @Column({
    name: 'profile_data',
    nullable: false,
    type: 'varchar',
    length: 800,
    default: 'NaN',
  })
  profile_data: string;

  @Column({
    name: 'image_consultant',
    nullable: false,
    type: 'varchar',
    length: 300,
    default: 'NaN',
  })
  image_consultant: string;

  @Column({
    name: 'status',
    nullable: false,
    default: 'inativo',
    type: 'varchar',
    length: 15,
  })
  status: string;

  @Column({
    name: 'payment_plan',
    nullable: false,
    default: 'mensal',
    type: 'varchar',
    length: 25,
  })
  payment_plan: string;

  @Column({
    name: 'appellant',
    nullable: false,
    type: 'boolean',
    default: false,
  })
  appellant: boolean;

  @Column({
    name: 'about_specialties',
    nullable: false,
    type: 'varchar',
    length: 700,
    default: 'NaN',
  })
  about_specialties: string;

  @Column({
    name: 'consultants_story',
    nullable: false,
    type: 'varchar',
    length: 700,
    default: 'NaN',
  })
  consultants_story: string;

  @Column({
    name: 'consultations_carried_out',
    nullable: true,
    default: 100,
    type: 'int',
  })
  consultations_carried_out: number;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 10,
    default: 'consultant',
  })
  role: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    () => ConsultantSpecialty,
    (consultantSpecialty) => consultantSpecialty.consultant,
  )
  consultantSpecialties: ConsultantSpecialty[];

  @OneToMany(
    () => ConsultantSupport,
    (consultantSupport) => consultantSupport.consultant,
  )
  consultantSupport: ConsultantSupport[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConsultantSpecialty } from './consultant_specialty.entity';

@Entity('consultant')
export class Consultant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false, type: 'varchar', length: 60 })
  name: string;

  @Column({ name: 'cpf', nullable: false, type: 'varchar', length: 11 })
  cpf: string;

  @Column({ name: 'phone', nullable: false, type: 'varchar', length: 15 })
  phone: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 60,
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    type: 'varchar',
    length: 300,
  })
  password: string;

  @Column({
    name: 'profile_data',
    nullable: false,
    type: 'varchar',
    length: 800,
  })
  profile_data: string;

  @Column({
    name: 'consultants_story',
    nullable: false,
    type: 'varchar',
    length: 700,
  })
  consultants_story: string;

  @Column({
    name: 'about_specialties',
    nullable: false,
    type: 'varchar',
    length: 700,
  })
  about_specialties: string;

  @Column({
    name: 'image_consultant',
    nullable: false,
    type: 'varchar',
    length: 300,
  })
  image_consultant: string;

  @Column({ name: 'consultations_carried_out', nullable: true, default: 100 })
  consultations_carried_out: number;

  @Column({ name: 'status', nullable: false, default: 'inativo' })
  status: string;

  @Column({ name: 'payment_plan', nullable: false, default: 'mensal' })
  payment_plan: string;

  @Column({
    name: 'appellant',
    nullable: false,
    type: 'boolean',
    default: false,
  })
  appellant: boolean;
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
}

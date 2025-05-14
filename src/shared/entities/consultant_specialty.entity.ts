import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Consultant } from './consultant.entity';
import { Specialty } from './specialty.entity';
import { ScheduleConsultant } from './schedule_consultant.entity';
import { Consultation } from './consultation.entity';

@Entity('consultant_specialty')
@Unique(['id_consultant', 'id_specialty'])
export class ConsultantSpecialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_consultant', nullable: false })
  id_consultant: number;

  @Column({ name: 'id_specialty', nullable: false })
  id_specialty: number;

  @Column({ name: 'duration', nullable: false })
  duration: number;

  @Column({ name: 'value_per_duration', nullable: false })
  value_per_duration: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relacionamento com a tabela Consultant
  @ManyToOne(() => Consultant, (consultant) => consultant.consultantSpecialties)
  @JoinColumn({ name: 'id_consultant' })
  consultant: Consultant;

  // Relacionamento com a tabela Specialty
  @ManyToOne(() => Specialty, (specialty) => specialty.consultantSpecialties)
  @JoinColumn({ name: 'id_specialty' })
  specialty: Specialty;

  @OneToMany(
    () => ScheduleConsultant,
    (scheduleConsultant) => scheduleConsultant.consultantSpecialty,
  )
  scheduleConsultant: ScheduleConsultant[];

  @OneToMany(
    () => Consultation,
    (consultation) => consultation.consultantSpecialty,
  )
  consultation: Consultation[];
}

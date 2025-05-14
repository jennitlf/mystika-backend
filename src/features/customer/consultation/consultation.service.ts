import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
  ) {}

  async create(createConsultationDto: any) {
    const {
      id_customer,
      id_consultant_specialty,
      id_schedule_consultant,
      appoinment_date,
      appoinment_time,
    } = createConsultationDto;
    const appoinmentVerification = await this.consultationRepository
      .createQueryBuilder('consultation')
      .andWhere('consultation.id_customer = :id_customer', { id_customer })
      .andWhere(
        'consultation.id_consultant_specialty = :id_consultant_specialty',
        { id_consultant_specialty },
      )
      .andWhere(
        'consultation.id_schedule_consultant = :id_schedule_consultant',
        { id_schedule_consultant },
      )
      .andWhere('consultation.appoinment_date = :appoinment_date', {
        appoinment_date,
      })
      .andWhere('consultation.appoinment_time = :appoinment_time', {
        appoinment_time,
      })
      .getOne();
    if (appoinmentVerification) {
      throw new HttpException(
        'appointment already scheduled!',
        HttpStatus.CONFLICT,
      );
    }
    const consultation = this.consultationRepository.create(
      createConsultationDto,
    );
    return this.consultationRepository.save(consultation);
  }

  async findAll(
    filters: {
      idCustomer?: number;
      idConsultantSpecialty?: number;
      appoinmentDate?: string;
      appoinmentTime?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const {
      idCustomer,
      idConsultantSpecialty,
      appoinmentDate,
      appoinmentTime,
    } = filters;
    const skip = (page - 1) * limit;

    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.customer', 'customer')
      .innerJoinAndSelect(
        'consultation.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      // Seleciona somente os campos desejados:
      .select([
        'consultation.id',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'consultation.id_schedule_consultant',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'specialty.name_specialty',
      ]);

    if (idCustomer) query.andWhere('customer.id = :idCustomer', { idCustomer });
    if (idConsultantSpecialty)
      query.andWhere('consultantSpecialty.id = :idConsultantSpecialty', {
        idConsultantSpecialty,
      });
    if (appoinmentDate)
      query.andWhere('consultation.appoinment_date = :appoinmentDate', {
        appoinmentDate,
      });
    if (appoinmentTime)
      query.andWhere('consultation.appoinment_time = :appoinmentTime', {
        appoinmentTime,
      });

    query.skip(skip).take(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const consultation = await this.consultationRepository.findOne({
      where: {
        id: +id,
      },
    });
    if (consultation) {
      throw new NotFoundException(`Consultation ID: ${id} not found`);
    }
    return consultation;
  }

  async update(id: string, updateConsultationDto: any) {
    const consultation = await this.consultationRepository.preload({
      ...updateConsultationDto,
      id: +id,
    });
    if (!consultation) {
      throw new NotFoundException(`Consultation ID: ${id} not found`);
    }
    return this.consultationRepository.save(consultation);
  }

  async remove(id: string) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: +id },
    });
    if (!consultation) {
      throw new NotFoundException(`Consultant ID: ${id} not found`);
    }
    return this.consultationRepository.remove(consultation);
  }
}

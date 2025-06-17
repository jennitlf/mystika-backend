// src/features/consultation/consultation.service.ts
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/features/email/email.service';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly emailService: EmailService,
  ) {}

  async create(dataUser, createConsultationDto: any) {
    const { id_schedule_consultant, appoinment_date, appoinment_time } =
      createConsultationDto;
    const appoinmentVerification = await this.consultationRepository
      .createQueryBuilder('consultation')
      .andWhere('consultation.id_customer = :id_customer', {
        id_customer: dataUser,
      })
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
    const consultationToSave = this.consultationRepository.create({
      id_customer: dataUser,
      ...createConsultationDto,
    });
    const savedResultOfSave: any =
      await this.consultationRepository.save(consultationToSave);

    let savedConsultation: Consultation;
    if (Array.isArray(savedResultOfSave) && savedResultOfSave.length > 0) {
      savedConsultation = savedResultOfSave[0];
    } else if (
      savedResultOfSave &&
      typeof savedResultOfSave === 'object' &&
      'id' in savedResultOfSave
    ) {
      savedConsultation = savedResultOfSave as unknown as Consultation;
    } else {
      console.error(
        'Erro: A operação de save não retornou uma entidade válida ou um array de entidades.',
        savedResultOfSave,
      );
      throw new HttpException(
        'Failed to save consultation: No valid entity returned.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!savedConsultation || !savedConsultation.id) {
      console.error(
        'Erro: A consulta salva ou seu ID ainda está faltando após a extração.',
        savedConsultation,
      );
      throw new HttpException(
        'Failed to retrieve ID for the newly created consultation.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const fullConsultation = await this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id = :id', {
        id: savedConsultation.id,
      })
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .getOne();
    if (
      fullConsultation &&
      fullConsultation.customer &&
      fullConsultation.scheduleConsultant?.consultantSpecialty?.consultant &&
      fullConsultation.scheduleConsultant.consultantSpecialty.specialty
    ) {
      const [year, month, day] = fullConsultation.appoinment_date
        .toString()
        .split('-');
      const formattedDate = `${day}/${month}/${year}`;

      await this.emailService.sendNewConsultationScheduledToConsultant(
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant
          .email,
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultation.customer.name,
        fullConsultation.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        formattedDate,
        fullConsultation.appoinment_time,
      );
    } else {
      console.warn(
        'Não foi possível obter detalhes completos da consulta para enviar e-mail de agendamento ao consultor. Verifique as relações.',
        {
          fullConsultationExists: !!fullConsultation,
          customerExists: !!fullConsultation?.customer,
          consultantExists:
            !!fullConsultation?.scheduleConsultant?.consultantSpecialty
              ?.consultant,
          specialtyExists:
            !!fullConsultation?.scheduleConsultant?.consultantSpecialty
              ?.specialty,
        },
      );
    }
    return savedConsultation;
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
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .innerJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultation.id',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'customer.id',
        'customer.name',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'consultant.id',
        'consultant.name',
        'specialty.id',
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

    const formattedData = data.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
            name: consultation.scheduleConsultant.consultantSpecialty.consultant
              .name,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
            name_specialty:
              consultation.scheduleConsultant.consultantSpecialty.specialty
                .name_specialty,
          },
          value_per_duration:
            consultation.scheduleConsultant.consultantSpecialty
              .value_per_duration,
          duration:
            consultation.scheduleConsultant.consultantSpecialty.duration,
        },
      },
      appoinment_date: consultation.appoinment_date,
      appoinment_time: consultation.appoinment_time,
      status: consultation.status,
    }));

    return {
      data: formattedData,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findByIdConsultation(id: string) {
    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.customer', 'customer')
      .innerJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .innerJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultation.id',
        'consultation.id_customer',
        'consultation.id_schedule_consultant',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'consultation.attended',
        'consultation.created_at',
        'consultation.updated_at',
        'customer.id',
        'customer.name',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'consultant.id',
        'consultant.name',
        'specialty.id',
        'specialty.name_specialty',
      ])
      .where('consultation.id = :id', { id: +id });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${id} not found`, HttpStatus.NOT_FOUND)
    }

    const formattedData = consultations.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
            name: consultation.scheduleConsultant.consultantSpecialty.consultant
              .name,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
            name_specialty:
              consultation.scheduleConsultant.consultantSpecialty.specialty
                .name_specialty,
          },
          value_per_duration:
            consultation.scheduleConsultant.consultantSpecialty
              .value_per_duration,
          duration:
            consultation.scheduleConsultant.consultantSpecialty.duration,
        },
      },
      appoinment_date: consultation.appoinment_date,
      appoinment_time: consultation.appoinment_time,
      status: consultation.status,
      attended: consultation.attended,
      created_at: consultation.created_at,
      updated_at: consultation.updated_at,
    }));
    return { data: formattedData };
  }

  async findOne(dataUser: number) {
    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.customer', 'customer')
      .innerJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .innerJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultation.id',
        'consultation.id_customer',
        'consultation.id_schedule_consultant',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'consultation.attended',
        'consultation.created_at',
        'consultation.updated_at',
        'customer.id',
        'customer.name',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'consultant.id',
        'consultant.name',
        'specialty.id',
        'specialty.name_specialty',
      ])
      .where('customer.id = :dataUser', { dataUser });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${dataUser} not found`, HttpStatus.NO_CONTENT)
    }

    const formattedData = consultations.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
            name: consultation.scheduleConsultant.consultantSpecialty.consultant
              .name,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
            name_specialty:
              consultation.scheduleConsultant.consultantSpecialty.specialty
                .name_specialty,
          },
          value_per_duration:
            consultation.scheduleConsultant.consultantSpecialty
              .value_per_duration,
          duration:
            consultation.scheduleConsultant.consultantSpecialty.duration,
        },
      },
      appoinment_date: consultation.appoinment_date,
      appoinment_time: consultation.appoinment_time,
      status: consultation.status,
      attended: consultation.attended,
      created_at: consultation.created_at,
      updated_at: consultation.updated_at,
    }));
    return { data: formattedData };
  }

  async findOneByIdConsultant(dataUser: number) {
    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.customer', 'customer')
      .innerJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .innerJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultation.id',
        'consultation.id_customer',
        'consultation.id_schedule_consultant',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'consultation.attended',
        'consultation.created_at',
        'consultation.updated_at',
        'customer.id',
        'customer.name',
        'customer.email',
        'customer.phone',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'consultant.id',
        'consultant.name',
        'specialty.id',
        'specialty.name_specialty',
      ])
      .where('consultant.id = :id', { id: dataUser });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${dataUser} not found`, HttpStatus.NOT_FOUND)
    }

    const formattedData = consultations.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
        email: consultation.customer.email,
        phone: consultation.customer.phone,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
            name: consultation.scheduleConsultant.consultantSpecialty.consultant
              .name,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
            name_specialty:
              consultation.scheduleConsultant.consultantSpecialty.specialty
                .name_specialty,
          },
          value_per_duration:
            consultation.scheduleConsultant.consultantSpecialty
              .value_per_duration,
          duration:
            consultation.scheduleConsultant.consultantSpecialty.duration,
        },
      },
      appoinment_date: consultation.appoinment_date,
      appoinment_time: consultation.appoinment_time,
      status: consultation.status,
      attended: consultation.attended,
      created_at: consultation.created_at,
      updated_at: consultation.updated_at,
    }));
    return { data: formattedData };
  }

  async cancelConsultationByCustomer(
    consultationId: string,
    customerId: number,
  ) {
    const consultation = await this.consultationRepository.preload({
      id: +consultationId,
    });
    if (!consultation) {
      // throw new NotFoundException(
      //   `Consulta com ID ${consultationId} não encontrada.`,
      // );
      throw new HttpException(`Consultations for user ID: ${consultationId} not found`, HttpStatus.NOT_FOUND)
    }
    // Valida se o cliente logado é o dono da consulta
    if (consultation.id_customer !== customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta consulta.',
      );
    }
    // Valida se o status atual permite o cancelamento pelo cliente (apenas 'pendente')
    if (consultation.status !== 'pendente') {
      throw new BadRequestException(
        'Somente consultas com status "pendente" podem ser canceladas pelo cliente.',
      );
    }
    const newStatus = 'cancelada';
    consultation.status = newStatus;

    const updatedConsultation =
      await this.consultationRepository.save(consultation);

    const fullConsultation = await this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id = :id', { id: updatedConsultation.id })
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .getOne();

    if (
      fullConsultation &&
      fullConsultation.customer &&
      fullConsultation.scheduleConsultant?.consultantSpecialty?.consultant
    ) {
      const [year, month, day] = fullConsultation.appoinment_date
        .toString()
        .split('-');
      const formattedDate = `${day}/${month}/${year}`;

      await this.emailService.sendConsultationCanceledByCustomerToConsultant(
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant
          .email,
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultation.customer.name,
        fullConsultation.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        formattedDate,
        fullConsultation.appoinment_time,
      );
    } else {
      console.warn(
        'Não foi possível obter detalhes completos da consulta para notificação de cancelamento ao consultor.',
      );
    }

    return updatedConsultation;
  }
  async findConsultationsByUserIdPaginated(
    userId: number,
    page: number,
    limit: number,
  ): Promise<[Consultation[], number]> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id_customer = :userId', { userId })
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .orderBy('consultation.appoinment_date', 'DESC')
      .addOrderBy('consultation.appoinment_time', 'DESC')
      .skip(skip)
      .take(limit);

    const [consultations, totalCount] = await queryBuilder.getManyAndCount();

    return [consultations, totalCount];
  }

  async updateStatusByConsultant(
    consultationId: string,
    updateConsultationDto: any,
    consultantId: number,
  ) {
    const consultation = await this.consultationRepository.preload({
      id: +consultationId,
    });

    if (!consultation) {
      throw new HttpException(`Consultations for user ID: ${consultationId} not found`, HttpStatus.NO_CONTENT)
    }
    const fullConsultationCheck = await this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id = :id', { id: +consultationId })
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .getOne();

    if (
      !fullConsultationCheck ||
      fullConsultationCheck.scheduleConsultant?.consultantSpecialty?.consultant
        .id !== consultantId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta consulta.',
      );
    }

    let emailNotificationNeeded = false;
    let oldStatus: string | undefined;
    let newStatus: string | undefined;

    if (updateConsultationDto.status !== undefined) {
      oldStatus = consultation.status;
      newStatus = updateConsultationDto.status;

      const allowedStatuses = ['pendente', 'realizada', 'cancelada'];
      if (!allowedStatuses.includes(newStatus)) {
        throw new BadRequestException(
          `Status inválido: ${newStatus}. Status permitidos são: ${allowedStatuses.join(', ')}`,
        );
      }
      if (oldStatus !== 'pendente' && oldStatus !== newStatus) {
        throw new BadRequestException(
          `O status da consulta já foi atualizado e não pode ser alterado novamente.`,
        );
      }
      if (oldStatus === 'pendente') {
        if (newStatus !== 'realizada' && newStatus !== 'cancelada') {
          throw new BadRequestException(
            `O status só pode ser alterado de 'pendente' para 'realizada' ou 'cancelada'.`,
          );
        }
      }
      if (oldStatus !== newStatus) {
        emailNotificationNeeded = true;
      }
    }
    Object.assign(consultation, updateConsultationDto);

    const updatedConsultation =
      await this.consultationRepository.save(consultation);

    if (
      emailNotificationNeeded &&
      oldStatus !== undefined &&
      newStatus !== undefined
    ) {
      const fullConsultation = await this.consultationRepository
        .createQueryBuilder('consultation')
        .where('consultation.id = :id', { id: updatedConsultation.id })
        .leftJoinAndSelect('consultation.customer', 'customer')
        .leftJoinAndSelect(
          'consultation.scheduleConsultant',
          'scheduleConsultant',
        )
        .leftJoinAndSelect(
          'scheduleConsultant.consultantSpecialty',
          'consultantSpecialty',
        )
        .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
        .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
        .getOne();

      if (
        fullConsultation &&
        fullConsultation.customer &&
        fullConsultation.scheduleConsultant?.consultantSpecialty?.consultant
      ) {
        const [year, month, day] = fullConsultation.appoinment_date
          .toString()
          .split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const customerEmail = fullConsultation.customer.email;
        const customerName = fullConsultation.customer.name;
        const consultantName =
          fullConsultation.scheduleConsultant.consultantSpecialty.consultant
            .name;
        const nameSpecialty =
          fullConsultation.scheduleConsultant.consultantSpecialty.specialty
            .name_specialty;
        const appointmentTime = fullConsultation.appoinment_time;

        if (newStatus === 'realizada') {
          await this.emailService.sendConsultationCompletedToCustomer(
            customerEmail,
            customerName,
            consultantName,
            nameSpecialty,
            formattedDate,
            appointmentTime,
          );
        } else if (newStatus === 'cancelada') {
          await this.emailService.sendConsultationCanceledByConsultantToCustomer(
            customerEmail,
            customerName,
            consultantName,
            nameSpecialty,
            formattedDate,
            appointmentTime,
          );
        }
      } else {
        console.warn(
          'Não foi possível obter detalhes completos da consulta para notificação de e-mail (atualização pelo consultor).',
        );
      }
    }

    return updatedConsultation;
  }

  async remove(id: string) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: +id },
    });
    if (!consultation) {
      throw new NotFoundException(`Consulta com ID: ${id} não encontrada`);
    }
    return this.consultationRepository.remove(consultation);
  }
}

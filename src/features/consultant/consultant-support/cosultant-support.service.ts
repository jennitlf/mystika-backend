import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConsultantSupportDto } from 'src/shared/dtos/create-consultant-support.dto';
import { UpdateConsultantSupportDto } from 'src/shared/dtos/update-consultant-support.dto';
import { ConsultantSupport } from 'src/shared/entities/consultant_support.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConsultantSupportService {
  constructor(
    @InjectRepository(ConsultantSupport)
    private readonly consultantSupportRepository: Repository<ConsultantSupport>,
  ) {}

  async create(
    UserId: any,
    createConsultantSupportDto: CreateConsultantSupportDto,
  ) {
    const consultantSupport = await this.consultantSupportRepository.create({
      id_consultant: UserId,
      ...createConsultantSupportDto,
    });
    try {
      return await this.consultantSupportRepository.save(consultantSupport);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Não foi possível criar registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    name?: string,
    email?: string,
    phone?: string,
    title?: string,
    content?: string,
    status?: string,
  ) {
    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 10 : limit;
  
    const skip = (page - 1) * limit;
  
    const query = this.consultantSupportRepository
      .createQueryBuilder('consultantSupport')
      .leftJoinAndSelect('consultantSupport.consultant', 'consultant')
      .leftJoinAndSelect('consultantSupport.adm', 'adm')
      .select([
        'consultantSupport.id',
        'consultantSupport.email',
        'consultantSupport.phone',
        'consultantSupport.title',
        'consultantSupport.content',
        'consultantSupport.status',
        'consultantSupport.createdAt',
        'consultantSupport.updatedAt',
        'consultant.name as consultant_name',
        'adm.name as adm_name',
      ]);
  
    if (name) {
      query.andWhere('LOWER(consultant.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }
    if (email) {
      query.andWhere('LOWER(consultantSupport.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });
    }
    if (phone) {
      query.andWhere('consultantSupport.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (title) {
      query.andWhere('LOWER(consultantSupport.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }
    if (content) {
      query.andWhere('LOWER(consultantSupport.content) LIKE :content', {
        content: `%${content.toLowerCase()}%`,
      });
    }
    if (status) {
      query.andWhere('LOWER(consultantSupport.status) = :status', {
        status: status.toLowerCase(),
      });
    }
  
    const [results, total] = await query
      .orderBy('consultantSupport.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  
    return {
      data: results,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const consultantSupport = await this.consultantSupportRepository.findOne({
      where: { id: id },
    });
    if (!consultantSupport) {
      throw new NotFoundException(`Consultant support ID: ${id} not found`);
    }
    return consultantSupport;
  }

  async findAllByUserId(userId: number) {
    const consultantSupport = await this.consultantSupportRepository.find({
      where: { id_consultant: userId },
    });
    if (!consultantSupport.length) {
      throw new NotFoundException(
        `No customer support records found for user ID: ${userId}`,
      );
    }
    return consultantSupport;
  }

  async update(id: number, _updateCustomerSupportDto: UpdateConsultantSupportDto) {
    const consultantSupport = await this.consultantSupportRepository.preload({
      ..._updateCustomerSupportDto,
      id: id,
    });
    return this.consultantSupportRepository.save(consultantSupport);
  }

  async remove(id: number) {
    const customerSupport = await this.consultantSupportRepository.findOne({
      where: { id: +id },
    });
    if (!customerSupport) {
      throw new NotFoundException(`Customer support ID: ${id} not found`);
    }
    return this.consultantSupportRepository.remove(customerSupport);
  }
}

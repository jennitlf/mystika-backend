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

  findAll() {
    return this.consultantSupportRepository.find();
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

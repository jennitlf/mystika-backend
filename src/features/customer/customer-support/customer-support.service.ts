import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerSupportDto } from 'src/shared/dtos/create-customer-support.dto';
import { CustomerSupport } from 'src/shared/entities/customer_support.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerSupportService {
  constructor(
    @InjectRepository(CustomerSupport)
    private readonly customerSupportRepository: Repository<CustomerSupport>,
  ) {}

  async create(
    dataUser: any,
    createCustomerSupportDto: CreateCustomerSupportDto,
  ) {
    const customerSupport = this.customerSupportRepository.create({
      id_customer: dataUser.id,
      email: dataUser.email,
      phone: dataUser.phone,
      ...createCustomerSupportDto,
    });
    try {
      return await this.customerSupportRepository.save(customerSupport);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível criar registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.customerSupportRepository.find();
  }

  async findOne(id: number) {
    const customerSupport = await this.customerSupportRepository.findOne({
      where: { id: id },
    });
    if (!customerSupport) {
      throw new NotFoundException(`Customer support ID: ${id} not found`);
    }
    return customerSupport;
  }

  async findAllByUserId(userId: number) {
    const customerSupport = await this.customerSupportRepository.find({
      where: { id_customer: userId },
    });
    if (!customerSupport.length) {
      throw new NotFoundException(
        `No customer support records found for user ID: ${userId}`,
      );
    }
    return customerSupport;
  }

  async update(id: number, _updateCustomerSupportDto: any) {
    const customerSupport = await this.customerSupportRepository.preload({
      ..._updateCustomerSupportDto,
      id: id,
    });
    return this.customerSupportRepository.save(customerSupport);
  }

  async remove(id: number) {
    const customerSupport = await this.customerSupportRepository.findOne({
      where: { id: +id },
    });
    if (!customerSupport) {
      throw new NotFoundException(`Customer support ID: ${id} not found`);
    }
    return this.customerSupportRepository.remove(customerSupport);
  }
}

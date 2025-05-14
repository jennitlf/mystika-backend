import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createUserDto: any) {
    const { email } = createUserDto;
    const verifiedUser = await this.customerRepository.findOne({
      where: { email: email },
    });
    if (verifiedUser) {
      throw new HttpException(
        `email already registered: ${email}`,
        HttpStatus.CONFLICT,
      );
    }
    const costumer = this.customerRepository.create(createUserDto);
    return this.customerRepository.save(costumer);
  }

  async findAll() {
    return this.customerRepository.find();
  }

  async findByEmail(email: string) {
    const costumer = await this.customerRepository.findOne({
      where: { email: email },
    });
    if (!costumer) {
      throw new NotFoundException(`Costumer not found`);
    }

    return costumer;
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: +id },
    });
    if (!customer) {
      throw new NotFoundException(`Costumer not found`);
    }
    return customer;
  }

  async update(id: number, updateUserDto: any) {
    const costumer = await this.customerRepository.preload({
      ...updateUserDto,
      id: +id,
    });
    return this.customerRepository.save(costumer);
  }

  async remove(id: string) {
    const costumer = await this.customerRepository.findOne({
      where: { id: +id },
    });
    if (!costumer) {
      throw new NotFoundException(`Costumer ID: ${id} not found`);
    }
    return this.customerRepository.remove(costumer);
  }
}

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';

@Injectable()
export class ConsultantService {
  constructor(
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,
  ) {}

  create(createConsultantDto: any) {
    const consultant = this.consultantRepository.create(createConsultantDto);
    return this.consultantRepository.save(consultant);
  }

  async findAll(page: number = 1, limit: number = 10) {
    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 10 : limit;

    const skip = (page - 1) * limit;

    const [data, total] = await this.consultantRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findByEmail(email: string) {
    const consultant = await this.consultantRepository.findOne({
      where: { email: email },
    });
    if (!consultant) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.BAD_REQUEST);
    }
    return consultant;
  }
  async findByEmailforRegister(email: string) {
    const consultant = await this.consultantRepository.findOne({
      where: { email: email },
    });
    if (!consultant) {
      return null;
    }
    return consultant;
  }
  

  async findByCpf(cpf: string) {
    const consultant = await this.consultantRepository.findOne({
      where: { cpf: cpf },
    });
    if (!consultant) {
      return null;
    }
    return consultant;
  }

  async findOne(id: string) {
    const consultant = await this.consultantRepository.findOne({
      where: { id: +id },
    });

    if (!consultant) {
      throw new NotFoundException(`consultant ID: ${id} not found`);
    }
    return consultant;
  }

  async update(id: string, updateConsultantDto: any) {
    const consultant = await this.consultantRepository.preload({
      ...updateConsultantDto,
      id: +id,
    });
    if (!consultant) {
      throw new NotFoundException(`Consultant ID: ${id} not found`);
    }
    return this.consultantRepository.save(consultant);
  }

  async remove(id: string) {
    const consultant = await this.consultantRepository.findOne({
      where: { id: +id },
    });
    if (!consultant) {
      throw new NotFoundException(`Consultant ID: ${id} not found`);
    }
    return this.consultantRepository.remove(consultant);
  }
}

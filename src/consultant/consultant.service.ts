import { Injectable, NotFoundException } from '@nestjs/common';
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
    const consultant = this.consultantRepository.create(createConsultantDto)
    return this.consultantRepository.save(consultant)
  }


  async findAll(page: number = 1, limit: number = 10) {

    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 10 : limit;

    // Calcular o offset
    const skip = (page - 1) * limit;

    // Obter os dados paginados e o total de registros
    const [data, total] = await this.consultantRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' }, 
    });

    // Retornar os dados e metadados
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

    const consultant = await this.consultantRepository.findOne({
      where:{id_consultant: +id},
    })

    if (!consultant) {
      throw new NotFoundException(`consultant ID: ${id} not found`)
    }
    return consultant;
  }

  async update(id: string, updateConsultantDto: any) {
    const consultant = await this.consultantRepository.preload({
      ...updateConsultantDto,
      id_consultant: +id
    })
    if (!consultant) {
      throw new NotFoundException(`Consultant ID: ${id} not found`)
    }
    return this.consultantRepository.save(consultant);
  }

  async remove(id: string) {
    const consultant = await this.consultantRepository.findOne({
      where: {id_consultant: +id}
    })
    if (!consultant) {
      throw new NotFoundException(`Consultant ID: ${id} not found`)
    }
    return this.consultantRepository.remove(consultant);
  }
  
}

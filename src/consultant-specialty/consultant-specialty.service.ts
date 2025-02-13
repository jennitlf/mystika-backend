import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';                                  
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';

@Injectable()
export class ConsultantSpecialtyService {

  constructor(
    @InjectRepository(ConsultantSpecialty)
    private readonly consultantSpecialtyRepository: Repository<ConsultantSpecialty>
  ){}

  create(createConsultantSpecialtyDto: any) {
    const consultantSpecialty = this.consultantSpecialtyRepository.create(createConsultantSpecialtyDto)
    return this.consultantSpecialtyRepository.save(consultantSpecialty)
  }

  async findConsultantsByFilters(
    filters: { consultantName?: string, idConsultant?:number, specialty?: string; minPrice?: number; maxPrice?: number },
    page: number = 1,
    limit: number = 10,
  ) {
    const { specialty, minPrice, maxPrice, consultantName, idConsultant} = filters;
    const skip = (page - 1) * limit;

    const query = this.consultantSpecialtyRepository.createQueryBuilder('consultantSpecialty')
    .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
    .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty');

    if (specialty) query.andWhere('specialty.name_specialty = :specialty', { specialty });
    if (minPrice) query.andWhere('consultantSpecialty.value_per_duration >= :minPrice', { minPrice });
    if (maxPrice) query.andWhere('consultantSpecialty.value_per_duration <= :maxPrice', { maxPrice });
    if (consultantName) {
      query.andWhere('consultant.name LIKE :consultantName', { consultantName: `%${consultantName}%` });
    }
    if (idConsultant) query.andWhere('consultant.id = :idConsultant', {idConsultant})

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
    const consultantSpecialty = await this.consultantSpecialtyRepository.findOne({
      where: {id: +id},
    })

    if(!consultantSpecialty){
      throw new NotFoundException(`Consultant Specialty ID: ${id} not found`)
    }

    return consultantSpecialty;
  }

  async update(id: string, updateConsultantSpecialtyDto: any) {
    const consultantSpecialty = await this.consultantSpecialtyRepository.preload({
      ...updateConsultantSpecialtyDto,
      id: +id
    })
    if(!consultantSpecialty){
      throw new NotFoundException(`Consultant Specialty ID: ${id} not found`)
    }
    return this.consultantSpecialtyRepository.save(consultantSpecialty);
  }

  async remove(id: string) {
    const consultant_specialty = await this.consultantSpecialtyRepository.findOne({
      where: {id: +id}
    })
    if (!consultant_specialty) {
      throw new NotFoundException(`Consultant Specialty ID: ${id} not found`)
    }
    return this.consultantSpecialtyRepository.remove(consultant_specialty);
  }
}

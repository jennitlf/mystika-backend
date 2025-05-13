import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultant } from 'src/shared/entities/consultant.entity';
import { Specialty } from 'src/shared/entities/specialty.entity';
import { ConsultantSpecialty } from 'src/shared/entities/consultant_specialty.entity';



@Injectable()
export class GeneralFindService {

  constructor(
    @InjectRepository(Consultant)
    private readonly consultantRepository: Repository<Consultant>,

    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,

    @InjectRepository(ConsultantSpecialty)
    private readonly ConsultantSpecialtyRepository: Repository<ConsultantSpecialty>

  ) {}


  async generalConsultantData(
    page: number = 1, 
    limit: number = 6, 
    name?: string,
    specialties?: string[], 
    minValue?: number, 
    maxValue?: number,
  ) {
    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 9 : limit;

    // Converta specialties para um array, se necessário
    if (specialties && !Array.isArray(specialties)) {
      specialties = [specialties];
    }
  
    const skip = (page - 1) * limit;
  
    const query = this.consultantRepository
      .createQueryBuilder('consultant')
      .innerJoinAndSelect('consultant.consultantSpecialties', 'consultantSpecialty')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultant.id as consultant_id',
        'consultant.name as consultant_name',
        'consultant.profile_data as consultant_profile',
        'consultant.image_consultant as img',
        'consultant.status as status',
        'consultantSpecialty.duration as duration',
        'consultantSpecialty.value_per_duration as value_per_duration',
        'specialty.id as id_specialty',
        'specialty.name_specialty as specialty_name',
      ])
      .where('consultant.status = :status', { status: 'ativo' });
  
    // Filtro por nome
    if (name) {
      query.andWhere('LOWER(consultant.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
    }
  
    // Filtro por valor mínimo
    if (minValue !== undefined) {
      query.andWhere('consultantSpecialty.value_per_duration >= :minValue', { minValue });
    }
  
    // Filtro por valor máximo
    if (maxValue !== undefined) {
      query.andWhere('consultantSpecialty.value_per_duration <= :maxValue', { maxValue });
    }
  
    // Filtro por especialidades
    if (specialties && specialties.length > 0) {
      if (!Array.isArray(specialties)) {
        throw new Error('The "specialties" parameter must be an array.');
      }
      query.andWhere('specialty.name_specialty IN (:...specialties)', { specialties });
    }
  
    const consultants = await query.getRawMany();
  
    const groupedConsultants = consultants.reduce((acc, item) => {
      let consultant = acc.find((c) => c.consultant_id === item.consultant_id);
  
      if (!consultant) {
        consultant = {
          consultant_id: item.consultant_id,
          consultant_name: item.consultant_name,
          img: item.img,
          consultant_profile: item.consultant_profile,
          status: item.status,
          specialties: [],
        };
        acc.push(consultant);
      }
  
      consultant.specialties.push({
        id: item.id,
        name: item.specialty_name,
        duration: item.duration,
        value_per_duration: item.value_per_duration,
      });
  
      return acc;
    }, []);
  
    const paginatedData = groupedConsultants.slice(skip, skip + limit);
  
    return {
      data: paginatedData,
      meta: {
        total: groupedConsultants.length,
        page,
        lastPage: Math.ceil(groupedConsultants.length / limit),
      },
    };
  }
  
}
function where(arg0: string, arg1: { status: string; }) {
  throw new Error('Function not implemented.');
}


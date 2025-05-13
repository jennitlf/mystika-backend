import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from 'src/shared/entities/specialty.entity';


@Injectable()
export class SpecialtyService {

  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>
  ){ }

  create(createSpecialtyDto: any) {

    const specialty = this.specialtyRepository.create(createSpecialtyDto)
    return this.specialtyRepository.save(specialty);
  }

  async findAll() {

    return this.specialtyRepository.find()
  }

  async findOne(id: string) {
    const specialty = await this.specialtyRepository.findOne({
      where:{id: +id}
    })

    if(!specialty){
      throw new NotFoundException(`Specialty ID: ${id} not found`)
    }
    return specialty;
  }

  async update(id: string, updateSpecialtyDto: any) {
    const specialty = await this.specialtyRepository.preload({
      ...updateSpecialtyDto,
      id: +id
    })
    if(!specialty){
      throw new NotFoundException(`Specialty ID: ${id} not found`)
    }
    return this.specialtyRepository.save(specialty);
  }

  async remove(id: string) {
    const specialty = await this.specialtyRepository.findOne({
      where: {id: +id}
    })
    if (!specialty){
      throw new NotFoundException(`Specialty ID: ${id} not found`)
    }
    return this.specialtyRepository.remove(specialty);
  }
}

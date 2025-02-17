import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';

@Injectable()
export class UserService {
  static findByEmail(email: string) {
    throw new Error('Method not implemented.');
  }
  static create(userDto: { password: string; name: string; phone: string; email: string; status: string; }) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(Customer)
    private readonly costumerRepository: Repository<Customer>
  ){}

  create(createUserDto: any) {
    const costumer = this.costumerRepository.create(createUserDto)
    return this.costumerRepository.save(costumer);
  }

  async findAll() {
    return this.costumerRepository.find();
  }

  async findByEmail(email: string) {
    const costumer = await this.costumerRepository.findOne({
      where:{email:email}
    })
    if(!costumer){
      throw new NotFoundException(`Costumer not found`)
    }

    return costumer;
  }

  // async findOne(id: string) {
  //   const costumer = await this.costumerRepository.findOne({
  //     where:{id_costumer:+id}
  //   })
  //   if(!costumer){
  //     throw new NotFoundException(`Costumer not found`)
  //   }
  //   return costumer;
  // }

  async update(id: number, updateUserDto: any) {
    const costumer = await this.costumerRepository.preload({
      ...updateUserDto,
      id: +id
    })
    return this.costumerRepository.save(costumer);
  }

  async remove(id: string) {
    const costumer = await this.costumerRepository.findOne({
      where: {id: +id}
    })
    if (!costumer) {
      throw new NotFoundException(`Costumer ID: ${id} not found`)
    }
    return this.costumerRepository.remove(costumer);
  }
}

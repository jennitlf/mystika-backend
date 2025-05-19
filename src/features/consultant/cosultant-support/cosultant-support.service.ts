import { Injectable } from '@nestjs/common';
// import { CreateCosultantSupportDto } from './dto/create-cosultant-support.dto';
// import { UpdateCosultantSupportDto } from './dto/update-cosultant-support.dto';

@Injectable()
export class CosultantSupportService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createCosultantSupportDto: any) {
    return 'This action adds a new cosultantSupport';
  }

  findAll() {
    return `This action returns all cosultantSupport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cosultantSupport`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateCosultantSupportDto: any) {
    return `This action updates a #${id} cosultantSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} cosultantSupport`;
  }
}

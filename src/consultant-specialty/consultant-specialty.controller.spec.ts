import { Test, TestingModule } from '@nestjs/testing';
import { ConsultantSpecialtyController } from './consultant-specialty.controller';
import { ConsultantSpecialtyService } from './consultant-specialty.service';

describe('ConsultantSpecialtyController', () => {
  let controller: ConsultantSpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultantSpecialtyController],
      providers: [ConsultantSpecialtyService],
    }).compile();

    controller = module.get<ConsultantSpecialtyController>(ConsultantSpecialtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConsultantSupportController } from './cosultant-support.controller';
import { ConsultantSupportService } from './cosultant-support.service';

describe('CosultantSupportController', () => {
  let controller: ConsultantSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultantSupportController],
      providers: [ConsultantSupportService],
    }).compile();

    controller = module.get<ConsultantSupportController>(ConsultantSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

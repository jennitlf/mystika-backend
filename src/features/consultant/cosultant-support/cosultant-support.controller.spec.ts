import { Test, TestingModule } from '@nestjs/testing';
import { CosultantSupportController } from './cosultant-support.controller';
import { CosultantSupportService } from './cosultant-support.service';

describe('CosultantSupportController', () => {
  let controller: CosultantSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosultantSupportController],
      providers: [CosultantSupportService],
    }).compile();

    controller = module.get<CosultantSupportController>(CosultantSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

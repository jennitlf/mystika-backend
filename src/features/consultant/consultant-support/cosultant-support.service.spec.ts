import { Test, TestingModule } from '@nestjs/testing';
import { ConsultantSupportService } from './cosultant-support.service';

describe('CosultantSupportService', () => {
  let service: ConsultantSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultantSupportService],
    }).compile();

    service = module.get<ConsultantSupportService>(ConsultantSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

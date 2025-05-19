import { Test, TestingModule } from '@nestjs/testing';
import { CosultantSupportService } from './cosultant-support.service';

describe('CosultantSupportService', () => {
  let service: CosultantSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosultantSupportService],
    }).compile();

    service = module.get<CosultantSupportService>(CosultantSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConsultantSpecialtyService } from './consultant-specialty.service';

describe('ConsultantSpecialtyService', () => {
  let service: ConsultantSpecialtyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultantSpecialtyService],
    }).compile();

    service = module.get<ConsultantSpecialtyService>(ConsultantSpecialtyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

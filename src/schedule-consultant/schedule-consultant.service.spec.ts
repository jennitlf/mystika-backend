import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConsultantService } from './schedule-consultant.service';

describe('ScheduleConsultantService', () => {
  let service: ScheduleConsultantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleConsultantService],
    }).compile();

    service = module.get<ScheduleConsultantService>(ScheduleConsultantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

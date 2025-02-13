import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConsultantController } from './schedule-consultant.controller';
import { ScheduleConsultantService } from './schedule-consultant.service';

describe('ScheduleConsultantController', () => {
  let controller: ScheduleConsultantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleConsultantController],
      providers: [ScheduleConsultantService],
    }).compile();

    controller = module.get<ScheduleConsultantController>(ScheduleConsultantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

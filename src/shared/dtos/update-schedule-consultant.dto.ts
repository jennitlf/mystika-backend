import { PartialType } from "@nestjs/mapped-types";
import { CreateScheduleConsultantDto } from "./create-schedule-consultant.dto";

export class UpdateScheduleConsultantDto extends PartialType(CreateScheduleConsultantDto){

};
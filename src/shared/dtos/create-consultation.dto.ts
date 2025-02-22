import { IsString, IsNumber, IsISO8601, IsNotEmpty } from "class-validator";

export class CreateConsultationDto{

    @IsNotEmpty()
    @IsNumber()
    readonly id_customer: number;

    @IsNotEmpty()
    @IsNumber()
    readonly id_consultant_specialty: number;

    @IsNotEmpty()
    @IsNumber()
    readonly id_schedule_consultant: number;

    @IsNotEmpty()
    @IsString()
    readonly appoinment_time: string;

    @IsNotEmpty()
    @IsISO8601()
    readonly appoinment_date: string;

    readonly status: string;
}
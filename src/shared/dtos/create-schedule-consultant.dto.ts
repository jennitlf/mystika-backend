import { IsString, IsNumber, IsNotEmpty, IsISO8601 } from "class-validator";

export class CreateScheduleConsultantDto {
 
    @IsNotEmpty()
    @IsNumber()
    readonly id_consultant_specialty: number;

    @IsNotEmpty()
    @IsISO8601() 
    readonly date: string;

    @IsNotEmpty()
    @IsNumber()
    readonly day_week: number;

    @IsNotEmpty()
    @IsString()
    readonly hour_initial: string;

    @IsNotEmpty()
    @IsString()
    readonly hour_end: string;

    
    @IsNotEmpty()
    @IsString()
    readonly status: string;

}
import { IsString, IsNumber, IsDate, IsNotEmpty } from "class-validator";

export default class CreateScheduleExceptionDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id_schedule_consultant: number;

    @IsNotEmpty()
    @IsDate()
    readonly date_exception: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly day_week: number;

    @IsNotEmpty()
    @IsString()
    readonly unavaiable_time: string;

    @IsNotEmpty()
    @IsString()
    readonly reason: string;
}
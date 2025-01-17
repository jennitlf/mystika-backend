import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateConsultantSpecialtyDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id_consultant: number;

    @IsNotEmpty()
    @IsNumber()
    readonly id_specialty: number;

    @IsNotEmpty()
    @IsNumber()
    readonly duration: number;


    @IsNotEmpty()
    @IsNumber()
    readonly value_per_duration: number;
}
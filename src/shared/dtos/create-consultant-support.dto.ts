import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateConsultantSupportDto {
    @IsNotEmpty()
    @IsString()
    readonly phone: string;
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    readonly title: string;
    @IsNotEmpty()
    @IsString()
    readonly content: string;
}
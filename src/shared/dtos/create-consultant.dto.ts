import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class CreateConsultantDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly cpf: string
    
    @IsNotEmpty()
    @IsString()
    readonly phone: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string
    
    @IsNotEmpty()
    @IsString()
    readonly password: string

    @IsNotEmpty()
    @IsString()
    readonly consultants_story: string

    @IsNotEmpty()
    @IsString()
    readonly about_specialties: string

    @IsNotEmpty()
    @IsString()
    readonly profile_data: string

    @IsNotEmpty()
    @IsString()
    readonly image_consultant: string

    @IsNotEmpty()
    @IsString()
    readonly status: string

    @IsNotEmpty()
    @IsString()
    readonly payment_plan: string
}
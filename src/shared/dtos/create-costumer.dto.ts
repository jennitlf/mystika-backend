import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class CreateCostumerDto{

    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly phone: string

    @IsNotEmpty()
    @IsString()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    readonly password: string

    @IsNotEmpty()
    @IsString()
    readonly status: string
}
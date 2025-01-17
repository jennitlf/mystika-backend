import { IsString, IsNotEmpty } from "class-validator";

export class CreateSpecialtyDto {

    @IsNotEmpty()
    @IsString()
    readonly name_specialty: string
}
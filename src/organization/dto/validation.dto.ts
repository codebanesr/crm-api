import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, MaxLength, MinLength } from "class-validator";

export class ValidateNewOrganizationDto {
    @IsIn(["email", "name"])
    label: string;

    @IsString()
    @MinLength(5)
    @MaxLength(25)
    value: string;
}
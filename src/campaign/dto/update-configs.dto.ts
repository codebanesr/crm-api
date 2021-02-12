import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateConfigsDto {
    @IsOptional()
    @IsBoolean()
    checked?: boolean;

    @IsNotEmpty()
    @IsString({always: true})
    internalField: string;


    @IsOptional()
    name?: string;

    @IsOptional()
    organization?: string;

    @IsNotEmpty()
    @IsString({always: true})
    readableField: string;

    @IsNotEmpty()
    @IsString({always: true})
    type: string;

    @IsOptional()
    _id?: string;
}
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, Allow } from "class-validator";



export class LeadDto {
    externalId: string
}


export class ReassignLeadDto {
    @ApiProperty({
        example: 'shanur@gcsns.com',
        description: 'Old users email',
        format: 'number',
        default: null
    })
    @IsEmail()
    oldUserEmail: string;

    @ApiProperty({
        example: 'shanur@gmail.com',
        description: 'Email of the new user',
        format: 'number',
        default: null
    })
    @IsEmail()
    newUserEmail: string;


    @ApiProperty({
        example: {externalId: 1234},
        description: 'Additional lead properties required to identify the lead',
        format: 'number',
        default: null
    })
    @Allow()
    lead: LeadDto
}


// oldUserEmail, newUserEmail, lead
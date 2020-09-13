import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsEnum, IsDateString, IsDate, IsIn } from "class-validator";
import { OrganizationalType } from "src/utils/organizational.enum";

export class CreateOrganizationDto {
    @ApiProperty({
        example: 'Molecular',
        description: 'The name for your organization',
        type: String,
        uniqueItems: true,
        minLength: 6,
        maxLength: 255,
      })
      @IsNotEmpty()
      @IsString()
      @MinLength(5)
      @MaxLength(255)
      @IsString()
      readonly name: string;

      @ApiProperty({
        example: OrganizationalType.TRIAL,
        description: 'Type of subscription',
        type: String,
      })
      @IsNotEmpty()
      @IsIn(Object.keys(OrganizationalType))
      readonly type: String = OrganizationalType.TRIAL;

      @ApiProperty({
        example: new Date(),
        description: 'When was the device last active',
        type: IsDateString,
      })
      @IsNotEmpty()
      @IsDateString()
      readonly lastActive: Date = new Date();
}
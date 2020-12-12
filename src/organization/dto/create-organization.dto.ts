import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsEnum, IsDateString, IsDate, IsIn, IsOptional, IsUrl } from "class-validator";
import { OrganizationalType } from "../../utils/organizational.enum";

/** @Todo add phone number and email as well with @OneOf */
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
      readonly organizationName: string;


      @ApiProperty({
        example: 'shanur@gmail.com',
        description: 'Please enter your email id',
        type: String,
        uniqueItems: true,
        minLength: 6,
        maxLength: 255,
      })
      @IsNotEmpty()
      @IsEmail()
      @MinLength(5)
      @MaxLength(255)
      @IsString()
      readonly email: string;



      @ApiProperty({
        example: OrganizationalType.TRIAL,
        description: 'Type of subscription',
        type: String,
      })
      @IsNotEmpty()
      @IsIn(Object.keys(OrganizationalType))
      readonly type: String = OrganizationalType.TRIAL;


      @ApiProperty({
        example: "+91",
        description: 'Country code',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(2)
      @MaxLength(4)
      phoneNumberPrefix: string = "+91"



      @ApiProperty({
        example: "8122242312",
        description: 'Phone Number',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(8)
      @MaxLength(14)
      phoneNumber: string



      @ApiProperty({
        example: "11Ads2",
        description: 'OTP sent to your mobile Number',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(4)
      @MaxLength(14)
      otp: string

      @ApiProperty({
        example: "Shanur Rahman",
        description: 'Full name of the account holder',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(4)
      @MaxLength(14)
      fullName: string


      @ApiProperty({
        example: "Password",
        description: 'Enter the password you want for your account',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(4)
      @MaxLength(14)
      password: string

      @ApiProperty({
        example: "https://s3.ap-south-1.amazonaws.com/molecule.static.files/_1607512889676anjeline.jpg",
        description: 'Enter the image for the organization for white labelling',
        type: String,
      })
      @IsUrl()
      organizationImage: string;
}
import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsEmail,
    IsString,
    IsIn,
    IsArray,
    ValidateIf,
    IsPhoneNumber,
  } from "class-validator";
  import { ApiProperty } from "@nestjs/swagger";
  import { Transform } from "class-transformer";
  
  export class CreateResellerDto {
    // fullName
    @ApiProperty({
      example: "pejman hadavi",
      description: "The name of the User",
      format: "string",
      minLength: 6,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly fullName: string;
  
    // Email
    @ApiProperty({
      example: "pejman@gmail.com",
      description: "The email of the User",
      format: "email",
      uniqueItems: true,
  
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;
  
    // Password
    @ApiProperty({
      example: "secret password change me!",
      description: "The password of the User",
      format: "string",
      minLength: 5,
      maxLength: 1024,
    })
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly password: string;
  
    @ApiProperty({
      example: "phoneNumber",
      description: "Phone number of the user being created",
      format: "string",
      minLength: 5,
      maxLength: 14,
    })
    @Transform(value => value.toString())
    @IsPhoneNumber('IN')
    phoneNumber: string


    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    companyName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    domain: string;


    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    @MinLength(3)
    address: string
  }
  
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
  IsEnum,
  IsIn,
  IsArray,
  ValidateIf,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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
    example: "manager",
    description: "Users role type",
    format: "string",
    minLength: 5,
    maxLength: 1024,
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["admin", "manager", "seniorManager", "frontline"])
  @MinLength(5)
  @MaxLength(1024)
  readonly roleType: string;

  @ApiProperty({
    example: ["user1@gmail.com"],
    description: "Every one that this user will manage",
    type: Array,
  })
  @ValidateIf((o) => o.roleType !== "admin")
  @ApiProperty({
    example: ["shanur@someemail.com", "manish@somecompany.com", "etc@etc.com"],
    description: "Email of people he manages",
    type: String,
  })
  @IsArray()
  readonly manages: string[];

  @ApiProperty({
    example: "seniorManager@gmail.com",
    description: "Who will he report to",
    type: String,
  })
  @ValidateIf((o) => o.roleType !== "admin")
  @ApiProperty()
  @IsString()
  readonly reportsTo: string;

  // is in validator has to be applied to every element in this array
  @ApiProperty({
    example: ["admin"],
    description: "What roles does this user have admin",
    type: String,
  })
  @ApiProperty()
  @IsArray()
  readonly roles: string[];
}

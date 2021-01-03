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
  // password is not readonly because it can be modified later on
  password: string;

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
    description: "What roles does this user have admin, admin can only assign admin and user roles or both / reseller roles can only be assigned by super admin / us",
    type: String,
  })
  @ApiProperty()
  @IsIn(["admin", "user"], {each: true})
  @IsString({each: true})
  readonly roles: string[];


  @ApiProperty({
    example: "phoneNumber",
    description: "Phone number of the user being created",
    format: "string",
    minLength: 5,
    maxLength: 14,
  })
  /**@Todo this will be isphonenumber */
  @Transform(value => value.toString())
  @IsPhoneNumber('IN')
  phoneNumber: string
}

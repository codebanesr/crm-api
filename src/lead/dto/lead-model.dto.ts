import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsString, IsOptional, IsEmail, IsNumber, Min, IsDateString, ValidateNested, IsPhoneNumber, IsMobilePhone } from "class-validator";
import { GeoLocation } from "../interfaces/geo-location.interface";

export class Lead {
    @ApiProperty({
      example: "1",
      description: "The id coming from external system",
      format: "string",
      default: "ABCDE",
    })
    @IsString()
    @IsOptional()
    externalId?: string;
  
    @ApiProperty({
      example: "shanur@gmail.com",
      description: "email of user that is creating the lead",
      type: String,
      required: false,
      default: null,
    })
    
    /** @Todo Check how to first do an optional validation and then email validation */
    // @IsEmail()
    @IsOptional()
    email?: string;
  
    @ApiProperty({
      example: "Campaign-spec-v1",
      description: "Campaign to which this lead belongs",
      type: String,
      default: "core",
    })
    @IsOptional()
    @IsString()
    campaign: string;
  
    @ApiProperty({
      example: "john",
      description: "Customer's first name to which this lead is associated with",
      type: String,
      default: "john",
    })
    @IsString()
    firstName: string;
  
    @ApiProperty({
      example: "doe",
      description: "Customer's last name to which this lead is associated with",
      type: String,
      default: "doe",
    })
    @IsOptional()
    @IsString()
    lastName: string;
  
    @ApiProperty({
      example: "1",
      description: "Source of lead",
      type: String,
      default: 1,
    })
    @IsOptional()
    @IsString()
    source: string;
  
    @ApiProperty({
      example: "1",
      description: "Source of lead",
      type: String,
      default: 1,
    })
    @IsOptional()
    @IsString()
    fullName: string;
  
  
    @ApiProperty({
      example: 1000,
      description: "Lead amount",
      type: Number,
      default: 0,
    })
    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    amount: number;
  
    @ApiProperty({
      example: "shanur@gcsns.com",
      description: "Customer's email ",
      type: String,
      default: "s@g.com",
    })
    @IsOptional()
    @IsEmail()
    customerEmail: string;
  
    @ApiProperty({
      example: "+91",
      description: "Phone number prefix",
      format: "number",
      default: 1,
    })
    @IsOptional()
    @IsString()
    phoneNumberPrefix?: string;
  
    @Transform(mobileNumber => {
      mobileNumber += "";
      if(mobileNumber.startsWith("+91")) {
        return mobileNumber
      } else if(mobileNumber.startsWith("+")) {
        return mobileNumber;
      }
      return "+91"+mobileNumber
    })
    @IsMobilePhone()
    mobilePhone: string;
  
    @ApiProperty({
      example: "Nurturing",
      description: "Describes the status of the lead",
      type: String,
      default: "CLOSED",
    })
    @IsOptional()
    @IsString()
    leadStatus: string;
  
    @ApiProperty({
      example: "Park view CA",
      description: "Address of the customer",
      type: String,
      default: "",
    })
    @IsOptional()
    @IsString()
    address: string;
  
    @ApiProperty({
      example: new Date(),
      description: "Page Number in paginated view",
      format: "number",
      default: new Date(),
    })
    @IsOptional()
    @IsDateString()
    followUp: Date;
  
    @ApiProperty({
      example: "moleculesns",
      description: "Name of company from which lead is coming",
      type: String,
      default: "unspecified",
    })
    @IsOptional()
    @IsString()
    companyName: string;
  
    @ApiProperty({
      example: "Very nice product",
      description: "Latest remark after disposition",
      type: String,
      default: "No remarks",
    })
    @IsOptional()
    @IsString()
    remarks: string;
  
    @ApiProperty({
      example: "CRM",
      description: "Describe the product",
      type: String,
      default: "",
    })
    @IsOptional()
    @IsString()
    product: string;
  
    @ApiProperty({
      example: "coordinates",
      required: false,
      description: "User's geo location",
      type: JSON,
      default: 1,
    })
    @ValidateNested()
    geoLocation: GeoLocation;
  
    @ApiProperty({
      example: "1",
      description: "Which bucket this product falls into",
      type: String,
      default: "Buck0",
    })
    @IsString()
    @IsOptional()
    bucket: string;
  
    @ApiProperty({
      example: "New Patliputra",
      description: "Describe the operational area of the customer/company",
      type: String,
      default: "NPC",
    })
    @IsString()
    @IsOptional()
    operationalArea: string;
  
    @ApiProperty({
      example: 808901,
      description: "Area Pincode",
      type: Number,
      default: "-",
    })
    @IsNumber()
    @IsOptional()
    pincode: number;
  
    @IsOptional()
    @IsString()
    nextAction?: string;
  
    @IsOptional()
    @IsString({each: true})
    documentLinks?: string[]
  }
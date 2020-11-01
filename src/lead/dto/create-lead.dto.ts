import {
  IsString,
  IsEmail,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { EmailTemplate } from "../interfaces/email-template.interface";
import { AttachmentDto } from "./create-email-template.dto";

class GeoLocation {
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class ReassignmentInfo {
  newUser: string;
}

export class Lead {
  @ApiProperty({
    example: "1",
    description: "The id coming from external system",
    format: "string",
    default: "ABCDE",
  })
  @IsString()
  externalId: string;

  @ApiProperty({
    example: "shanur@gmail.com",
    description: "email of user that is creating the lead",
    type: String,
    required: false,
    default: null,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Campaign-spec-v1",
    description: "Campaign to which this lead belongs",
    type: String,
    default: "core",
  })
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
  @IsString()
  lastName: string;

  @ApiProperty({
    example: "1",
    description: "Source of lead",
    type: String,
    default: 1,
  })
  @IsString()
  source: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 1000,
    description: "Lead amount",
    type: Number,
    default: 0,
  })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: "shanur@gcsns.com",
    description: "Customer's email ",
    type: String,
    default: "s@g.com",
  })
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

  @ApiProperty({
    example: "9199945454",
    description: "Mobile Number",
    type: String,
    default: "-",
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: "Nurturing",
    description: "Describes the status of the lead",
    type: String,
    default: "CLOSED",
  })
  @IsString()
  leadStatus: string;

  @ApiProperty({
    example: "Park view CA",
    description: "Address of the customer",
    type: String,
    default: "",
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: new Date(),
    description: "Page Number in paginated view",
    format: "number",
    default: new Date(),
  })
  @IsDateString()
  followUp: Date;

  @ApiProperty({
    example: "moleculesns",
    description: "Name of company from which lead is coming",
    type: String,
    default: "unspecified",
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    example: "Very nice product",
    description: "Latest remark after disposition",
    type: String,
    default: "No remarks",
  })
  @IsString()
  remarks: string;

  @ApiProperty({
    example: "CRM",
    description: "Describe the product",
    type: String,
    default: "",
  })
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
}

export class CreateLeadDto {
  lead: Lead;
  geoLocation: GeoLocation;

  @IsOptional()
  reassignmentInfo?: ReassignmentInfo;

  @IsOptional()
  emailForm: {
    attachments: {
      filePath: string;
      fileName: string;
    };
    content: string;
    subject: string;
  };
}

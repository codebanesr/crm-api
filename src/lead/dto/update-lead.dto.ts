import {
  IsNumber,
  IsOptional,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsMobilePhone,
  IsEmail,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ECallStatus } from "../enum/call-status.enum";
import { Lead } from "./lead-model.dto";

class GeoLocation {
  @IsNumber({}, { each: true })
  coordinates: number[];
}

class CallRecord {
  number: string;

  duration: number;

  @Type(()=>Number)
  type: number;

  @IsEnum(ECallStatus)
  callStatus: string;
}

export class UpdateLead extends Lead {
  // try using this from createlead dto itself
  @Transform(mobileNumber => {
    if(mobileNumber.startsWith("+91")) {
      return mobileNumber
    } else if(mobileNumber.startsWith("+")) {
      return mobileNumber;
    }
    return "+91"+mobileNumber
  })
  @IsMobilePhone()
  mobilePhone: string;
  @IsOptional()
  notes?: string;
}

export class UpdateLeadDto {
  @ValidateNested()
  @Type(() => UpdateLead)
  lead: UpdateLead;

  @ValidateNested()
  geoLocation: GeoLocation;

  @IsOptional()
  @IsEmail()
  reassignToUser?: string;

  @IsOptional()
  emailForm: {
    attachments: {
      filePath: string;
      fileName: string;
    };
    content: string;
    subject: string;
  };

  @IsNotEmpty()
  @IsMongoId()
  campaignId: string;

  requestedInformation?: { [key: string]: string }[];

  @IsOptional()
  @ValidateNested()
  callRecord?: CallRecord;
}

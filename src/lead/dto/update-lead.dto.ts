import {
  IsNumber,
  IsOptional,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsMobilePhone,
} from "class-validator";
import { Type } from "class-transformer";
import { ECallStatus } from "../enum/call-status.enum";
import { Lead } from "./lead-model.dto";

class GeoLocation {
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class ReassignmentInfo {
  newUser: string;
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
  @IsMobilePhone('en-IN', {})
  mobilePhone: string;
}

export class UpdateLeadDto {
  @ValidateNested()
  @Type(() => UpdateLead)
  lead: UpdateLead;

  @ValidateNested()
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

  @IsNotEmpty()
  @IsMongoId()
  campaignId: string;

  requestedInformation?: { [key: string]: string }[];

  @IsOptional()
  @ValidateNested()
  callRecord?: CallRecord;
}

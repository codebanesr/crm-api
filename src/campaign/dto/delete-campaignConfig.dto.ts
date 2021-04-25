import { IsMongoId, IsNotIn, IsString, NotContains } from "class-validator";

export class DeleteCampaignConfigDto {
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotIn(['mobilePhone', 'firstName', 'followUp'], {message: "This field cannot be deleted"})
  internalField: string;

  @IsString()
  readableField: string;

  @IsMongoId()
  campaignId: string;
}

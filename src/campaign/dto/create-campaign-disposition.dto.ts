import { IsBoolean, IsJSON, IsMongoId, IsNotEmpty, IsObject, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCampaignAndDispositionDto {
  // @ApiProperty({
  //   description: "Contains the disposition tree for the given campaign",
  //   example:
  //     "This will be a stringified json tree structure, check db schema for more details",
  // })
  // @IsString()
  // dispositionData: string;

  // @ApiProperty({
  //   description: "Contains information about the campaign",
  //   example: "Check the database schema for more details",
  // })
  // @IsString()
  // campaignInfo: string;

    // @IsJSON()
    dispositionData: any;

    // @IsJSON()
    campaignInfo: any;
    
    @IsString({each: true})
    editableCols: string;

    @IsString({each: true})
    browsableCols: string;

    @IsString({each: true})
    uniqueCols: string;

    // @IsJSON()
    formModel: JSON;

    @IsString({each: true})
    assignTo: string;

    // @IsJSON()
    advancedSettings: string;

    // @IsString({each: true})
    groups: string;
    
    @IsNotEmpty()
    @IsBoolean()
    isNew: boolean;

    /** @Todo add better validations here, form is strictly defined */
    @IsObject()
    autodialSettings: JSON
}

import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateIf } from "class-validator";
import { EActions, Trigger } from "../rules.constants";

export class RuleDto {
    @IsMongoId()
    campaign: string;

    @IsNotEmpty()
    @IsEnum(EActions)
    action: EActions;

    @IsString()
    changeHandler: string;

    @ValidateIf( o => o.trigger === Trigger.overdueFollowups )
    @IsNotEmpty()
    @IsNumber()
    daysOverdue: number;

    @ValidateIf( o => o.trigger === Trigger.repeatedDisposition )
    @IsNotEmpty()
    @IsString()
    disposition: string;

    @ValidateIf( o => o.trigger === Trigger.dispositionChange )
    @IsNotEmpty()
    @IsString()
    fromDisposition: string;

    @ValidateIf( o => o.action ===  EActions.changeDisposition)
    @IsNotEmpty()
    @IsString()
    newDisposition: string;

    @ValidateIf( o => o.action ===  EActions.changeProspectHandler )
    @IsNotEmpty()
    @IsMongoId()
    newHandler: string;

    @ValidateIf( o => o.trigger === Trigger.numberOfAttempts )
    @IsNotEmpty()
    @IsNumber()
    numberOfAttempts: number;

    @ValidateIf( o => o.trigger === Trigger.dispositionChange )
    @IsNotEmpty()
    @IsString()
    toDisposition: string;

    @IsNotEmpty()
    @IsEnum(Trigger)
    trigger: Trigger;

    @ValidateIf( o => o.action ===  EActions.callApi)
    @IsNotEmpty()
    @IsUrl()
    url: string;
}
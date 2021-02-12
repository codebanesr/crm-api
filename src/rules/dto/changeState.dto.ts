import { IsBoolean, IsMongoId } from "class-validator";

export class ChangeStateDto {
    @IsBoolean()
    isActive: boolean;

    @IsMongoId()
    ruleId: string;
}
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class BatteryStatusDto {
    @IsNotEmpty()
    @IsNumber()
    batLvl: number;
}
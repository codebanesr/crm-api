import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class BatteryStatusDto {
    @IsNotEmpty()
    batLvl: number;
}
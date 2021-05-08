import { IsNumber, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateOrderDto {
  @Transform((v: string | number) => +v)
  @IsNumber()
  amount: 1000000;

  @MaxLength(5)
  currency: string;

  @IsString()
  receipt: string;

  payment_capture: number;

  notes: {
    notes_key_1: string;
    notes_key_2: string;
  };
}

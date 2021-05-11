import {
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";

class OrderMeta {
  @Transform((v: string | number) => +v)
  @IsNumber()
  perUserRate: number;

  @Transform((v: string | number) => +v)
  @IsNumber()
  discount: number;

  @Transform((v: string | number) => +v)
  @IsNumber()
  seats: number;

  @Transform((v: string | number) => +v)
  @IsNumber()
  total: number;

  @Transform((v: string | number) => +v)
  @IsNumber()
  months: number;
}
export class CreateOrderDto {
  @Transform((v: string | number) => +v)
  @IsNumber()
  amount: number;

  @MaxLength(5)
  currency: string;

  @ValidateNested()
  notes: OrderMeta;
}

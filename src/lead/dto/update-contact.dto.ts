import { IsString } from "class-validator";

export class UpdateContactDto {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsString()
  category: string;
}

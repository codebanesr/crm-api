import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class GenerateTokenDto {
    @ApiProperty({
        example: '+9199946568',
        description: 'Mobile number where you want to receive the otp',
        type: String,
        minLength: 8,
        maxLength: 14,
      })
      @IsNotEmpty()
      @IsString()
      @MinLength(8)
      @MaxLength(14)
      @IsString()
      readonly mobileNumber: string;
}
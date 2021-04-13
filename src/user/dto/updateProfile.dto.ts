import { MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @MinLength(5)
  @MaxLength(1024)
  confirmNewPassword: string;

  @MinLength(5)
  @MaxLength(255)
  fullName: string;

  @MinLength(5)
  @MaxLength(1024)
  newPassword: string;

  @MinLength(5)
  @MaxLength(1024)
  password: string;

  @MinLength(5)
  @MaxLength(1024)
  phoneNumber: string;
}

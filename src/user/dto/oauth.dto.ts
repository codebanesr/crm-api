import { IsString, MinLength } from "class-validator";

export class OAuthDto {
    @IsString()
    @MinLength(3)
    provider: string;

    @IsString()
    @MinLength(5)
    idToken: string;
}

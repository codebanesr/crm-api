import { Injectable } from "@nestjs/common";
import { generate } from "otp-generator";

@Injectable()
export class SharedService {
    generateOtp() {
        return generate(6, { upperCase: false, specialChars: false })
    }
}

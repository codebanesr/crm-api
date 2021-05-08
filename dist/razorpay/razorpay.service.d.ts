import { CreateOrderDto } from "../order/dto/CreateOrder.dto";
import { AxiosInstance } from "axios";
import { VerificationDto } from "../order/dto/Verification.dto";
export declare class RazorpayService {
    verifyOrder(verificationDto: VerificationDto, razorpaySignature: string): Promise<"OK" | "Invalid">;
    axiosInstance: AxiosInstance;
    constructor();
    createOrder(orderDto: CreateOrderDto): Promise<any>;
}

import { CreateOrderDto } from "../order/dto/CreateOrder.dto";
import { AxiosInstance } from "axios";
import { VerificationDto } from "../order/dto/Verification.dto";
import { OrderCreated } from "../order/interfaces/OrderCreated.interface";
export declare class RazorpayService {
    axiosInstance: AxiosInstance;
    constructor();
    createOrder(orderDto: CreateOrderDto): Promise<OrderCreated>;
    verifyOrder(verificationDto: VerificationDto): Promise<{
        status: string;
    }>;
}

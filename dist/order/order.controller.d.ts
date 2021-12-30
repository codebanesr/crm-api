import { CreateOrderDto } from "./dto/CreateOrder.dto";
import { VerificationDto } from "./dto/Verification.dto";
import { RazorpayService } from "../razorpay/razorpay.service";
export declare class OrderController {
    private razorpayService;
    constructor(razorpayService: RazorpayService);
    createOrder(orderDto: CreateOrderDto): Promise<import("./interfaces/OrderCreated.interface").OrderCreated>;
    verifyOrder(verificationDto: VerificationDto): Promise<{
        status: string;
    }>;
}

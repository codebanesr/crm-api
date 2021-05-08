import { Controller, Headers, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/CreateOrder.dto";
import { VerificationDto } from "./dto/Verification.dto";
import { RazorpayService } from "../razorpay/razorpay.service";

@Controller("order")
export class OrderController {
  constructor(private razorpayService: RazorpayService) {}
  @Post("create")
  async createOrder(orderDto: CreateOrderDto) {
    return this.razorpayService.createOrder(orderDto);
  }

  @Post("verify")
  async verifyOrder(
    verificationDto: VerificationDto,
    @Headers("x-razorpay-signature") razorpaySignature: string
  ) {
    return this.razorpayService.verifyOrder(verificationDto, razorpaySignature);
  }
}

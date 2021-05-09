/** https://github.com/HarshMalve/razorpay -> Complete example */
import { Body, Controller, Headers, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/CreateOrder.dto";
import { VerificationDto } from "./dto/Verification.dto";
import { RazorpayService } from "../razorpay/razorpay.service";

@Controller("order")
export class OrderController {
  constructor(private razorpayService: RazorpayService) {}

  @Post("create")
  async createOrder(@Body() orderDto: CreateOrderDto) {
    return this.razorpayService.createOrder(orderDto);
  }

  @Post("verify")
  async verifyOrder(@Body() verificationDto: VerificationDto) {
    return this.razorpayService.verifyOrder(verificationDto);
  }
}

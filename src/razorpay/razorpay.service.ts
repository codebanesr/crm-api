import { Injectable, Logger } from "@nestjs/common";
import { CreateOrderDto } from "../order/dto/CreateOrder.dto";
import axios, { AxiosInstance } from "axios";
import config from "../config/config";
import { createHmac } from "crypto";
import { VerificationDto } from "../order/dto/Verification.dto";
import { OrderCreated } from "../order/interfaces/OrderCreated.interface";
import { v4 as uuidV4 } from "uuid";

@Injectable()
export class RazorpayService {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://api.razorpay.com/v1",
      auth: {
        username: config.razorpay.username,
        password: config.razorpay.password,
      },
    });
  }

  async createOrder(orderDto: CreateOrderDto): Promise<OrderCreated> {
    const receipt = uuidV4();
    const payload = {
      ...orderDto,
      receipt,
    };
    const result = await this.axiosInstance.post("orders", payload);
    return result.data;
  }

  async verifyOrder(verificationDto: VerificationDto) {
    const secret = config.razorpay.secret;

    const shasum = createHmac("sha256", secret);
    shasum.update(
      verificationDto.razorpay_order_id +
        "|" +
        verificationDto.razorpay_payment_id
    );
    const digest = shasum.digest("hex");

    if (digest === verificationDto.razorpay_signature) {
      return { status: "OK" };
    }
    return { status: "INVALID" };
  }
}

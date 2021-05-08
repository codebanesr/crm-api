import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "../order/dto/CreateOrder.dto";
import axios, { AxiosInstance } from "axios";
import config from "../config/config";
import { createHmac } from "crypto";
import { VerificationDto } from "../order/dto/Verification.dto";

@Injectable()
export class RazorpayService {
  async verifyOrder(
    verificationDto: VerificationDto,
    razorpaySignature: string
  ) {
    const secret = config.razorpay.secret;

    const shasum = createHmac("sha256", secret);
    shasum.update(JSON.stringify(verificationDto));
    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) {
      return "OK";
    }
    return "Invalid";
  }

  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://api.razorpay.com/v1/",
      auth: {
        username: config.razorpay.username,
        password: config.razorpay.password,
      },
    });
  }
  async createOrder(orderDto: CreateOrderDto) {
    const result = await this.axiosInstance.post("/orders", orderDto);
    return result.data;
  }
}

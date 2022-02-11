import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrganizationSchema, TransactionSchema } from "../organization/schema";
import { RazorpayModule } from "../razorpay/razorpay.module";
import { OrderController } from "./order.controller";

@Module({
  imports: [
    RazorpayModule,
    MongooseModule.forFeature([
      { name: "Organization", schema: OrganizationSchema },
      { name: "Transaction", schema: TransactionSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [],
})
export class OrderModule {}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const razorpay_module_1 = require("../razorpay/razorpay.module");
const organization_1 = require("../organization");
const order_controller_1 = require("./order.controller");
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    common_1.Module({
        imports: [
            razorpay_module_1.RazorpayModule,
            mongoose_1.MongooseModule.forFeature([
                { name: "Organization", schema: organization_1.OrganizationSchema },
                { name: "Transaction", schema: organization_1.TransactionSchema },
            ]),
        ],
        controllers: [order_controller_1.OrderController],
        providers: [],
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map
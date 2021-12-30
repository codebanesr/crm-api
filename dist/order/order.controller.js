"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const CreateOrder_dto_1 = require("./dto/CreateOrder.dto");
const Verification_dto_1 = require("./dto/Verification.dto");
const razorpay_service_1 = require("../razorpay/razorpay.service");
let OrderController = class OrderController {
    constructor(razorpayService) {
        this.razorpayService = razorpayService;
    }
    createOrder(orderDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.razorpayService.createOrder(orderDto);
        });
    }
    verifyOrder(verificationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.razorpayService.verifyOrder(verificationDto);
        });
    }
};
__decorate([
    common_1.Post("create"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrder_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    common_1.Post("verify"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Verification_dto_1.VerificationDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "verifyOrder", null);
OrderController = __decorate([
    common_1.Controller("order"),
    __metadata("design:paramtypes", [razorpay_service_1.RazorpayService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map
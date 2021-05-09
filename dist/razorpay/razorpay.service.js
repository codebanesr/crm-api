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
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("../config/config");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
let RazorpayService = class RazorpayService {
    constructor() {
        this.axiosInstance = axios_1.default.create({
            baseURL: "https://api.razorpay.com/v1",
            auth: {
                username: config_1.default.razorpay.username,
                password: config_1.default.razorpay.password,
            },
        });
    }
    createOrder(orderDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = uuid_1.v4();
            const payload = Object.assign(Object.assign({}, orderDto), { receipt });
            const result = yield this.axiosInstance.post("orders", payload);
            return result.data;
        });
    }
    verifyOrder(verificationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = config_1.default.razorpay.secret;
            const shasum = crypto_1.createHmac("sha256", secret);
            shasum.update(verificationDto.razorpay_order_id +
                "|" +
                verificationDto.razorpay_payment_id);
            const digest = shasum.digest("hex");
            if (digest === verificationDto.razorpay_signature) {
                return { status: "OK" };
            }
            return { status: "INVALID" };
        });
    }
};
RazorpayService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], RazorpayService);
exports.RazorpayService = RazorpayService;
//# sourceMappingURL=razorpay.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.NotificationService = void 0;
const nodemailer_1 = require("nodemailer");
const common_1 = require("@nestjs/common");
const config_1 = require("src/config/config");
const client_sns_1 = require("@aws-sdk/client-sns");
let NotificationService = class NotificationService {
    constructor() {
        this.transporter = nodemailer_1.createTransport({
            host: config_1.default.ses.region,
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.ses.username,
                pass: config_1.default.ses.password
            }
        });
        this.snsClient = new client_sns_1.SNSClient({ region: config_1.default.ses.region });
    }
    sendMail(options) {
        const mailOptions = {
            to: options.to,
            from: options.from || config_1.default.ses.supportEmail,
            subject: options.subject,
            text: options.text,
            attachments: options.attachments,
            html: options.html
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    sendSms() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            const command = new client_sns_1.AddPermissionCommand(params);
            const data = yield this.snsClient.send(command).catch(error => {
                console.log({ message: "An error occured while sending message", error });
            });
            return data;
        });
    }
};
NotificationService = __decorate([
    common_1.Injectable()
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map
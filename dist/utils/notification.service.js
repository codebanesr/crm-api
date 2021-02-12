"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const nodemailer_1 = require("nodemailer");
const common_1 = require("@nestjs/common");
let NotificationService = class NotificationService {
    sendMail(options) {
        const transporter = nodemailer_1.createTransport({
            host: "email-smtp.ap-south-1.amazonaws.com",
            port: 587,
            secure: false,
            auth: {
                user: "AKIARGBOXP35JVPETBOW",
                pass: "BDABocMfTh7ONWhD9Xh9tHSvAtsOC9vT4eL/YF5TI1/g"
            }
        });
        const mailOptions = {
            to: options.to,
            from: options.from || 'mail.moleculesystem.com',
            subject: options.subject,
            text: options.text,
            attachments: options.attachments,
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("email sent to ", options.to);
            }
        });
        return true;
    }
};
NotificationService = __decorate([
    common_1.Injectable()
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map
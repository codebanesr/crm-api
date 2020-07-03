"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
exports.sendEmail = (email, subject, text, attachments) => {
    const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
        }
    });
    const mailOptions = {
        to: email,
        from: "shanur.rahman@gamechangesns.com",
        subject: "Reset your password on Molecule",
        text: `Hi there this is a campaign email`,
        attachments: attachments
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("email sent to ", email);
        }
    });
};
//# sourceMappingURL=sendMail.js.map
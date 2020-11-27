"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
exports.sendEmail = (email, subject, text, attachments) => {
    const transporter = nodemailer_1.createTransport({
        service: "SendGrid",
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD,
        },
    });
    const mailOptions = {
        to: email,
        from: "shanur.rahman@gamechangesns.com",
        subject: "Reset your password on Molecule",
        text: `Hi there this is a campaign email`,
        attachments: attachments,
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
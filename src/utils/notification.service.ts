import { createTransport, SendMailOptions } from "nodemailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  sendMail(options: SendMailOptions) {
    const transporter = createTransport({
      // pool: true,
      host: "email-smtp.ap-south-1.amazonaws.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: "AKIARGBOXP35JVPETBOW",
        pass: "BDABocMfTh7ONWhD9Xh9tHSvAtsOC9vT4eL/YF5TI1/g"
      }
    });
    const mailOptions: SendMailOptions = {
      to: options.to,
      from: options.from || 'mail.moleculesystem.com',
      subject: options.subject,
      text: options.text,
      attachments: options.attachments,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent to ", options.to);
      }
    });
    return true;
  }
}

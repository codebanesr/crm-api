import { createTransport, SendMailOptions } from "nodemailer";
import { Injectable } from "@nestjs/common";
import config from "src/config/config";

@Injectable()
export class NotificationService {
  transporter = createTransport({
    // pool: true,
    host: config.ses.region,
    port: 587,
    secure: false, // use TLS
    auth: {
      user: config.ses.username,
      pass: config.ses.password
    }
  });


  sendMail(options: SendMailOptions) {
    const mailOptions: SendMailOptions = {
      to: options.to,
      from: options.from || config.ses.supportEmail,
      subject: options.subject,
      text: options.text,
      attachments: options.attachments,
      html: options.html
    };
    
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    })
  }
}

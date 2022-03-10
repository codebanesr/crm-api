import { createTransport, SendMailOptions } from "nodemailer";
import { Injectable } from "@nestjs/common";
import config from "../config/config";
import { SNSClient, AddPermissionCommand } from "@aws-sdk/client-sns";

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

  snsClient = new SNSClient({ region: config.ses.region });
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
          console.error({message: "Error occured while sending email", error})
          reject(error);
        } else {
          resolve(true);
        }
      });
    })
  }


  async sendSms() {
    const params = {
      /** input parameters */
    } as any;
    const command = new AddPermissionCommand(params);
    const data = await this.snsClient.send(command).catch(error => {
      console.log({message: "An error occured while sending message", error});
    });

    return data;
  }
}

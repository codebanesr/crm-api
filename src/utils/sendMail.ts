import { createTransport, SendMailOptions } from "nodemailer";

export const sendEmail = (
  email: string,
  subject: string,
  text: string,
  attachments?: any
) => {
  const transporter = createTransport({
    service: "SendGrid",
    auth: {
      user: process.env.SENDGRID_USER,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });
  const mailOptions: SendMailOptions = {
    to: email,
    from: "shanur.rahman@gamechangesns.com",
    subject: "Reset your password on Molecule",
    text: `Hi there this is a campaign email`,
    attachments: attachments,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent to ", email);
    }
  });
};

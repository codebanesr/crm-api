import {Request, Response, NextFunction } from 'express';
import { isArray } from 'lodash';
import { AuthReq } from '../../interface/authorizedReq';
import EmailTemplate from '../../models/EmailTemplate';
import { sendEmail } from '../../util/sendMail';
export const saveEmailAttachments = (req: AuthReq, res: Response) => {
    const files = req.files;
    return res.status(200).send({ files });
};
  

// filePath: String,
// fileName: String
export const createEmailTemplate = async (req: AuthReq, res: Response) => {
    const { email } = req.user;
    const { content, subject, campaign, attachments } = req.body;
  
    let acceptableAttachmentFormat = attachments.map((a: any) => {
      let { originalname: fileName, path: filePath, ...others } = a;
      return {
        fileName,
        filePath,
        ...others,
      };
    });
    const emailTemplate = new EmailTemplate({
      campaign: campaign,
      email: email,
      content: content,
      subject: subject,
      attachments: acceptableAttachmentFormat,
    });
  
    const result = await emailTemplate.save();
  
    return res.status(200).json(result);
};
  


// const result = await Campaign.find({type: {$regex: "^"+hint, $options:"I"}}).limit(20);
export const getAllEmailTemplates = async (req: AuthReq, res: Response) => {
    let { limit = 10, skip = 0, campaign } = req.query;
  
    limit = Number(limit);
    skip = Number(skip);
    const query = EmailTemplate.aggregate();
    const result = await query
      .match({ campaign: { $regex: `^${campaign}`, $options: "I" } })
      .sort("type")
      .limit(limit)
      .skip(skip)
      .exec();
  
    return res.status(200).send(result);
  };
  

// {
//     filename: 'text3.txt',
//     path: '/path/to/file.txt'
// }
export const sendBulkEmails = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let { emails, subject, text, attachments } = req.body;
    emails = isArray(emails) ? emails : [emails];
    emails = emails.join(",");
    try {
      sendEmail(emails, subject, text, attachments);
      res.status(200).send({ success: true });
    } catch (e) {
      res.status(400).send({ error: e.message });
      console.log(e);
    }
  };
  
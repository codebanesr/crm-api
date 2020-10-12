import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from '../campaign/interfaces/campaign.interface';
import { CallLog } from '../lead/interfaces/call-log.interface';
import { CampaignConfig } from '../lead/interfaces/campaign-config.interface';
import { EmailTemplate } from '../lead/interfaces/email-template.interface';
import { Lead } from '../lead/interfaces/lead.interface';
import { User } from '../user/interfaces/user.interface';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel("Lead")
        private readonly leadModel: Model<Lead>,
    
        @InjectModel("User")
        private readonly userModel: Model<User>,
    
        @InjectModel("CampaignConfig")
        private readonly campaignConfigModel: Model<CampaignConfig>,
    
        @InjectModel("Campaign")
        private readonly campaignModel: Model<Campaign>,
    
        @InjectModel("EmailTemplate")
        private readonly emailTemplateModel: Model<EmailTemplate>,
    
        @InjectModel("CallLog")
        private readonly callLogModel: Model<CallLog>,    
    ) {}    




    getAggregatedLeadStatus(dateArray) {
        const leadAgg = this.leadModel.aggregate();
        let startDate, endDate;
        if (dateArray) {
          [startDate, endDate] = dateArray;
          startDate = new Date(startDate);
          endDate = new Date(endDate);
          leadAgg.match({
            updatedAt: { $gte: startDate, $lt: endDate },
          });
        }

        leadAgg.group( {
            _id: {leadStatus: "$leadStatus"}, 
            totalAmount:  {$sum: "$amount"}
        });

        Logger.debug(leadAgg)
        return leadAgg.exec()
    }
}

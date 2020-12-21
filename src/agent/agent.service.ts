import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { createReadStream } from "fs";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";

@Injectable()
export class AgentService {
  constructor(
    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,


    @InjectModel("User")
    private readonly userModel: Model<User>
  ) {}

  async listActions(
    activeUserId: string,
    organization: string,
    skip,
    fileType,
    sortBy = "handler",
    me,
    campaign: string
  ) {

    return this.adminActionModel.find({
      campaign,
      organization
    }).sort({createdAt: -1}).limit(20).lean().exec();
    // const fq = this.adminActionModel.aggregate();
    // fq.match({ organization, campaign });

    // if (me) {
    //   fq.match({ userid: activeUserId });
    // }

    // // if (fileType) {
    // //   fq.match({ fileType });
    // // }

    // fq.lookup({
    //   from: "users",
    //   localField: "userid",
    //   foreignField: "_id",
    //   as: "userdetails",
    // });

    // fq.unwind({ path: "$userdetails" });

    // fq.project({
    //   email: "$userdetails.email",
    //   savedOn: "$userdetails.savedOn",
    //   filePath: "$filePath",
    //   actionType: "$actionType",
    //   createdAt: "$createdAt",
    //   label: "$label",
    // });

    // fq.sort({ createdAt: -1 });
    // fq.skip(Number(skip));
    // fq.limit(20);
    // return fq.exec();
  }

  async downloadFile(location: string, res: Response) {
    const readStream = createReadStream(location as string);
    readStream.on("close", () => {
      res.end();
    });
    readStream.pipe(res);
  }


  async updateBatteryStatus(userId: string, batLvlDto: BatteryStatusDto) {
    return this.userModel.findByIdAndUpdate(userId, {
      $set: {
        batLvl: batLvlDto.batLvl
      }
    });
  }
}

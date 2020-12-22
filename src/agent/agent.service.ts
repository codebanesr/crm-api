import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { createReadStream } from "fs";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { VisitTrack } from "./interface/visit-track.interface";
import { AddLocationDto } from "./dto/add-location.dto";
import { intersection } from "lodash";

@Injectable()
export class AgentService {
  constructor(
    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

    @InjectModel("VisitTrack")
    private readonly visitTrackModel: Model<VisitTrack>,

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
    Logger.debug(`saving battery status  ${userId}, ${batLvlDto}, ${typeof batLvlDto.batLvl}, ${batLvlDto.batLvl}`)
    return this.visitTrackModel.findOneAndUpdate({userId}, {
      $set: {
        batLvl: batLvlDto.batLvl
      }
    }, {upsert: true});
  }


  async addVisitTrack(userId: string, payload: AddLocationDto) {
    Logger.debug(`userid: ${userId}, coorinates: ${payload.coordinate}`);

    return this.visitTrackModel.findOneAndUpdate({userId}, {
      $push: {
        locations: {...payload.coordinate, timestamp: new Date()}
      }
    }, {upsert: true})
  }


  async getVisitTrack(id: string, roleType: string, organization: string ,userIds: string[]) {
    const subordinateIds = await this.getSubordinates(id, roleType); 

    /** @Todo check if intersection works as expected */
    const validUserIds = intersection(userIds, subordinateIds, [id])

    Logger.debug(`validUserIds ${validUserIds}`);
    return this.visitTrackModel.find({ userId: {$in: validUserIds}});
  }


    /** @Todo replace getSubordinates in user.service with this one, checked: true is missing over there, and this should be
   * moved into a shared service
   */
  async getSubordinates(id: string, roleType: string) {
    if (roleType === "frontline") {
      return [id];
    }
    const fq: any = [
      { $match: { _id: id } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$manages",
          connectFromField: "manages",
          connectToField: "_id",
          as: "subordinates",
        },
      },
      {
        $project: {
          subordinates: "$subordinates._id",
          roleType: "$roleType",
          hierarchyWeight: 1,
        },
      },
    ];

    const result = await this.userModel.aggregate(fq);
    return [id, ...result[0].subordinates];
  }
}

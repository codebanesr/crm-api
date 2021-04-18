import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { createReadStream } from "fs";
import { Response } from "express";
import { AdminAction } from "../agent/interface/admin-actions.interface";
import { User } from "../user/interfaces/user.interface";
import { BatteryStatusDto } from "./schemas/battery-status.dto";
import { VisitTrack } from "./interface/visit-track.interface";
import { AddLocationDto } from "./dto/add-location.dto";
import { intersection, union } from "lodash";
import { GetUsersLocationsDto } from "./dto/get-user-locations.dto";
import * as moment from "moment";
import { Logger } from "nestjs-pino";

@Injectable()
export class AgentService {
  constructor(
    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>,

    @InjectModel("VisitTrack")
    private readonly visitTrackModel: Model<VisitTrack>,

    @InjectModel("User")
    private readonly userModel: Model<User>,

    private logger: Logger
  ) {}


  // schema filter not working in this service call
  async listActions(
    activeUserId: string,
    organization: string,
    skip,
    fileType,
    sortBy = "handler",
    me,
    campaign: string
  ) {
    const fq = this.adminActionModel.aggregate();
    /** @Todo check why automatic objectid type conversion is failing in this case */
    fq.match({ campaign: Types.ObjectId(campaign) });

    if (me) {
      fq.match({ userid: activeUserId });
    }

    if (fileType) {
      // fq.match({ fileType });
    }

    fq.lookup({
      from: "users",
      localField: "userid",
      foreignField: "_id",
      as: "userdetails",
    });

    fq.unwind({ path: "$userdetails" });

    fq.project({
      email: "$userdetails.email",
      savedOn: "$userdetails.savedOn",
      filePath: "$filePath",
      fileType: "$fileType",
      actionType: "$actionType",
      createdAt: "$createdAt",
      label: "$label",
    });

    fq.sort({ createdAt: -1 });
    fq.skip(Number(skip));
    fq.limit(20);
    const result = await fq.exec();
    return result;
  }

  async downloadFile(location: string, res: Response) {
    const readStream = createReadStream(location as string);
    readStream.on("close", () => {
      res.end();
    });
    readStream.pipe(res);
  }


  async updateBatteryStatus(userId: string, batLvlDto: BatteryStatusDto) {
    this.logger.log(`saving battery status  ${userId}, ${batLvlDto}, ${typeof batLvlDto.batLvl}, ${batLvlDto.batLvl}`)
    return this.visitTrackModel.findOneAndUpdate({userId}, {
      $set: {
        batLvl: batLvlDto.batLvl
      }
    }, {upsert: true});
  }


  async addVisitTrack(userId: string, payload: AddLocationDto) {
    this.logger.log(`userid: ${userId}, coorinates: ${payload.coordinate}`);


    const start = moment().startOf('day');
    const end = moment().endOf('day');

    return this.visitTrackModel.findOneAndUpdate({userId, createdAt: {$gte: start, $lt: end}}, {
      $push: {
        locations: {...payload.coordinate, timestamp: new Date()}
      }
    }, {upsert: true})
  }


  async getVisitTrack(id: string, roleType: string, organization: string ,userLocationDto: GetUsersLocationsDto) {
    let subordinateIds = await this.getSubordinates(id, roleType);
    subordinateIds = subordinateIds.map(s=>s.toString())

    const { campaign, startDate, endDate, userIds } = userLocationDto;
    /** @Todo check if intersection works as expected */
    let validUserIds = intersection(userIds, subordinateIds);
    validUserIds = union(validUserIds, [id.toString()]);

    return this.visitTrackModel.find({
      userId: {$in: validUserIds},
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean().populate('userId', 'fullName roles roleType').exec();
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

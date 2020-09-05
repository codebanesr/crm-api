import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { createReadStream } from "fs";
import { Response } from "express";
import { AdminAction } from "../user/interfaces/admin-actions.interface";

@Injectable()
export class AgentService {
  constructor(
    @InjectModel("AdminAction")
    private readonly adminActionModel: Model<AdminAction>
  ) {}

  async listActions(
    activeUserId: string,
    skip,
    fileType,
    sortBy = "handler",
    me
  ) {
    const matchQ = {} as any;
    if (fileType) {
      matchQ.fileType = fileType;
    }

    if (me) {
      matchQ.userid = new Types.ObjectId(activeUserId);
    }

    const fq = [
      { $match: matchQ },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $unwind: { path: "$userdetails" },
      },
      {
        $project: {
          email: "$userdetails.email",
          savedOn: "$userdetails.savedOn",
          filePath: "$filePath",
          actionType: "$actionType",
          createdAt: "$createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: Number(skip) },
      {
        $limit: 10,
      },
    ];
    return this.adminActionModel.aggregate(fq);
  }

  async downloadFile(location: string, res: Response) {
    const readStream = createReadStream(location as string);
    readStream.on("close", () => {
      res.end();
    });
    readStream.pipe(res);
  }
}

import { NextFunction, Response, Request } from "express";
import { AuthReq } from "../../interface/authorizedReq";
import GeoLocation from "../../models/GeoLocation";
import mongoose from "mongoose";
export const addGeolocation = async (req: AuthReq, res: Response, next: NextFunction) => {
    const { lat, lng } = req.body;
    console.log(req.body);
    const { id } = req.user;
    var geoObj = new GeoLocation({
      userid: mongoose.Types.ObjectId(id),
      location: {
        type: 'Point',
        // Place longitude first, then latitude
        coordinates: [lng, lat]
      }
    });
    const result = await geoObj.save();
  
    return res.status(200).json(result);
  };
  
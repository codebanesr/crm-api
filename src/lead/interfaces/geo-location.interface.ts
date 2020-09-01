import { Document } from "mongoose";

export interface GeoLocation extends Document {
    userid: string,
    location: Location
}


interface Location {
    type: string,
    coordinates: number[]
}
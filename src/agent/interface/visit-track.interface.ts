import {Document} from "mongoose";


interface Location {
    lat: number;
    lng: number;
    timestamp: Date;
}


export interface VisitTrack extends Document {
    userId: string;
    batLvl: number;
    isGpsEnabled: boolean;
    locations: Location[]
}
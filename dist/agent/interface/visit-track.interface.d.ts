import { Document } from "mongoose";
interface Location {
    lat: number;
    lng: number;
    timestamp: Date;
}
export interface VisitTrack extends Document {
    userId: string;
    batteryStatus: number;
    isGpsEnabled: boolean;
    locations: Location[];
}
export {};

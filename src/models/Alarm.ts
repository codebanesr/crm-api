import mongoose from "mongoose";




export interface IAlarm {   
    severity: string,
    module: string,
    tag: string,
    moduleId: string,
    userEmail: string,
    deleted?: boolean,
    seen?: boolean,

    message?: string
};


const AlarmSchema = new mongoose.Schema({
    deleted: {type: Boolean, default: false},
    module : {type: String, required: true},
    moduleId: {type: String, required: true},
    tag: String,
    severity: String,
    userEmail: { type: String, required: true },
    seen: {type: Boolean, default: false},
    message: {type: String}
}, {timestamps: true});

export default mongoose.model("Alarm", AlarmSchema);
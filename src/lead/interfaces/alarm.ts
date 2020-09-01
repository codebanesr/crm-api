import { Document } from 'mongoose';

export interface Alarm extends Document{   
    severity: string,
    module: string,
    tag: string,
    moduleId: string,
    userEmail: string,
    deleted?: boolean,
    seen?: boolean,
    message?: string
}
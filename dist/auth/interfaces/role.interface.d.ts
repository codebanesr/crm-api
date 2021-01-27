import { Document } from 'mongoose';
export interface Role extends Document {
    value: string;
    label: string;
    permissions: Permission[];
}
interface Permission {
    label: string;
    value: string;
    checked: boolean;
}
export {};

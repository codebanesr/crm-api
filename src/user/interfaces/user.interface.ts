import { Document, Schema } from "mongoose";
import { RoleType } from "../../shared/role-type.enum";

export interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
  verification: string;
  verified: boolean;
  verificationExpires: Date;
  reportsTo?: string;
  loginAttempts?: number;
  blockExpires?: Date;
  bankAccountNumber?: string;
  bankAccountName?: string;
  batLvl: number;
  roleType: RoleType;
  phoneNumber: string;
  singleLoginKey: string;
  // manages: string[];
  history: string[];
  hierarchyWeight: number;
  organization: string;
  pushtoken: {
    endpoint: string;
    expirationTime: any;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

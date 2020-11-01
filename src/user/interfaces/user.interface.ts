import { Document, Schema } from "mongoose";

export interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
  verification: string;
  verified: boolean;
  verificationExpires: Date;
  loginAttempts?: number;
  blockExpires?: Date;
  bankAccountNumber?: string;
  bankAccountName?: string;
  roleType: string;
  manages: string[];
  history: string[];
  hierarchyWeight: number;
  organization: string;
}

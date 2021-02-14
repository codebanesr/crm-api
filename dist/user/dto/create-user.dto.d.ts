import { RoleType } from "../../shared/role-type.enum";
export declare class CreateUserDto {
    readonly fullName: string;
    readonly email: string;
    password: string;
    readonly roleType: RoleType;
    readonly reportsTo?: string;
    phoneNumber: string;
}

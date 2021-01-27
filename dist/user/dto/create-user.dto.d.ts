export declare class CreateUserDto {
    readonly fullName: string;
    readonly email: string;
    password: string;
    readonly roleType: string;
    readonly manages: string[];
    readonly reportsTo: string;
    readonly roles: string[];
    phoneNumber: string;
}

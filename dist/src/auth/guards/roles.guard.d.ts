import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const RolesGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class RolesGuard extends RolesGuard_base {
    private readonly reflector;
    constructor(reflector: Reflector);
    handleRequest(err: any, user: any, info: Error, context: ExecutionContext): any;
}
export {};

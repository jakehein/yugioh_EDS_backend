import { Strategy } from 'passport-http-bearer';
import { AuthService, UserResult } from './auth.service';
declare const BearerStrategy_base: new (...args: any[]) => Strategy<import("passport-http-bearer").VerifyFunctions>;
export declare class BearerStrategy extends BearerStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(token: string): Promise<UserResult>;
}
export {};

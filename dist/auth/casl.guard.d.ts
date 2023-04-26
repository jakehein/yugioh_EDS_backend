import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility } from './casl-abilities';
export declare type CaslAbilityHandler = (ability: AppAbility) => boolean;
export declare const CASL_ABILITY_HANDLERS: unique symbol;
export declare const CaslAbilityHandlers: (...handlers: CaslAbilityHandler[]) => import("@nestjs/common").CustomDecorator<typeof CASL_ABILITY_HANDLERS>;
export declare class CaslGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}

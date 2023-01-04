import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../request.interface';
import { AppAbility, defineAbilityFor } from './casl-abilities';

export type CaslAbilityHandler = (ability: AppAbility) => boolean;

export const CASL_ABILITY_HANDLERS = Symbol('CASL_ABILITY_HANDLERS');

export const CaslAbilityHandlers = (...handlers: CaslAbilityHandler[]) =>
  SetMetadata(CASL_ABILITY_HANDLERS, handlers);

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const ability = defineAbilityFor(user.user);

    const caslAbilityHandlers = this.reflector.getAllAndMerge<
      CaslAbilityHandler[]
    >(CASL_ABILITY_HANDLERS, [context.getHandler(), context.getClass()]);

    return caslAbilityHandlers.every((handler) => handler(ability));
  }
}

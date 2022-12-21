import { ForbiddenException } from '@nestjs/common';
import { User } from '../user/user.schema';
import { AppAbility, defineAbilityFor } from './casl-abilities';

export function throwUnlessAuthorized(
  user: User,
  pred: (ability: AppAbility) => boolean,
) {
  const ability = defineAbilityFor(user);

  if (!pred(ability)) {
    throw new ForbiddenException();
  }
}

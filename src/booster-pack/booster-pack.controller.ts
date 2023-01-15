import { BoosterPackService } from './booster-pack.service';
import { UserService } from '../user/user.service';
import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';
import { BoosterPackOfUser, User } from '../user/user.schema';
import { ObjectId } from '@mikro-orm/mongodb';
import { throwUnlessAuthorized } from '../auth/casl-helper';

@CommonGuardedControllerDecorator('Booster Packs', 'user/:userId/booster-pack')
export class BoosterPackController {
  constructor(
    private readonly userService: UserService,
    private readonly boosterPackService: BoosterPackService,
  ) {}

  private async ensureCanReadOrUpdateBoosterPackForUser(
    requestingUser: User,
    userId: string,
    intent: 'read' | 'update',
  ): Promise<User> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.boostersAvailable) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        user.boostersAvailable.every((boosterPack) =>
          ability.can(
            intent,
            new BoosterPackOfUser(boosterPack, new ObjectId(userId)),
          ),
        ),
      );
    }
    return user;
  }
}

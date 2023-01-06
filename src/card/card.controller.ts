import { Get, Param } from '@nestjs/common';
import { CardService } from './card.service';
import { RequestUser } from '../request-user.decorator';
import { TrunkOfUser, User, UserCard } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { ObjectId } from '@mikro-orm/mongodb';
import { throwUnlessAuthorized } from '../auth/casl-helper';
import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';

@CommonGuardedControllerDecorator('Cards', 'user/:userId/cards')
export class CardController {
  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {}

  @Get(':cardId')
  async GetCardById(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ): Promise<{ card: UserCard }> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.trunk) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        user.trunk.every((card) =>
          ability.can('read', new TrunkOfUser(card, new ObjectId(userId))),
        ),
      );
    }

    const card = this.cardService.getCard(user, cardId);
    if (!card) {
      throw Error('placeholder error');
    }

    return { card };
  }

  @Get()
  async GetTrunk(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ trunk: UserCard[] }> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.trunk) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        user.trunk.every((card) =>
          ability.can('read', new TrunkOfUser(card, new ObjectId(userId))),
        ),
      );
    }

    const trunk = this.cardService.getTrunk(user);
    return { trunk };
  }
}

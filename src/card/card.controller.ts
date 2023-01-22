import { Get, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { RequestUser } from '../request-user.decorator';
import { TrunkOfUser, User, UserCard } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { ObjectId } from '@mikro-orm/mongodb';
import { throwUnlessAuthorized } from '../auth/casl-helper';
import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';
import { ICard, ICardCopies } from './card.interface';

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
    const user = await this.ensureCanReadOrUpdateTrunkForUser(
      requestingUser,
      userId,
      'read',
    );

    const card = this.cardService.getCardFromTrunk(user, cardId);
    if (!card) {
      throw Error('placeholder error');
    }

    return { card };
  }

  @Get(':cardId/card-content')
  async GetCardContent(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ): Promise<{ card: ICard }> {
    await this.ensureCanReadOrUpdateTrunkForUser(
      requestingUser,
      userId,
      'read',
    );

    return { card: this.cardService.getCardContent(cardId) };
  }

  @Get()
  async GetTrunk(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ trunk: UserCard[] }> {
    const user = await this.ensureCanReadOrUpdateTrunkForUser(
      requestingUser,
      userId,
      'read',
    );

    const trunk = this.cardService.getTrunk(user);
    return { trunk };
  }

  @Post(':cardId/add-card-by-id')
  async AddCardToTrunkById(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ): Promise<{ card: UserCard }> {
    const user = await this.ensureCanReadOrUpdateTrunkForUser(
      requestingUser,
      userId,
      'update',
    );

    const card = this.cardService.addToTrunk(user, cardId);
    return { card };
  }

  @Post(':passcode/add-card-by-passcode')
  async AddCardToTrunkByPasscode(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('passcode') passcode: string,
  ): Promise<{ cards: UserCard[] }> {
    const user = await this.ensureCanReadOrUpdateTrunkForUser(
      requestingUser,
      userId,
      'update',
    );

    const cards = this.cardService.addToTrunkByPasscode(user, passcode);
    return { cards };
  }

  private async ensureCanReadOrUpdateTrunkForUser(
    requestingUser: User,
    userId: string,
    intent: 'read' | 'update',
  ): Promise<User> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.trunk) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        user.trunk.every((card) =>
          ability.can(intent, new TrunkOfUser(card, new ObjectId(userId))),
        ),
      );
    }
    return user;
  }
}

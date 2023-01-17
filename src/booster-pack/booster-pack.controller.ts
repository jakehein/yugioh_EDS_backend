import { BoosterPackService } from './booster-pack.service';
import { UserService } from '../user/user.service';
import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';
import {
  BoosterPackOfUser,
  User,
  UserBoosterPack,
  UserCard,
} from '../user/user.schema';
import { ObjectId } from '@mikro-orm/mongodb';
import { throwUnlessAuthorized } from '../auth/casl-helper';
import { RequestUser } from '../request-user.decorator';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { BoosterPack, ICard } from '../card/card.interface';
import { IBoosterPack } from './booster-pack.interface';
import { CardIdsDto } from './booster-pack.dto';

@CommonGuardedControllerDecorator('Booster Packs', 'user/:userId/booster-pack')
export class BoosterPackController {
  constructor(
    private readonly userService: UserService,
    private readonly boosterPackService: BoosterPackService,
  ) {}

  @Get('/available')
  async GetAvailableBoosterPacks(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ boosterPacks: UserBoosterPack[] }> {
    const user = await this.ensureCanReadOrUpdateBoosterPackForUser(
      requestingUser,
      userId,
      'read',
    );

    const boosterPacks = this.boosterPackService.getAvailableBoosters(user);
    return { boosterPacks };
  }

  @Get('/completed')
  async GetCompletedBoosterPacks(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ boosterPacks: UserBoosterPack[] }> {
    const user = await this.ensureCanReadOrUpdateBoosterPackForUser(
      requestingUser,
      userId,
      'read',
    );

    const boosterPacks = this.boosterPackService.getCompletedBoosters(user);
    return { boosterPacks };
  }

  @Get('/:boosterId/booster-content')
  async GetBoosterPackContent(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('boosterId') boosterId: BoosterPack,
  ): Promise<{ boosterPack: IBoosterPack }> {
    await this.ensureCanReadOrUpdateBoosterPackForUser(
      requestingUser,
      userId,
      'read',
    );

    const boosterPack =
      this.boosterPackService.getBoosterPackContent(boosterId);
    return { boosterPack };
  }

  @Get('/:boosterId/booster-content/cards')
  async GetBoosterPackContentCards(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('boosterId') boosterId: BoosterPack,
  ): Promise<{ cards: ICard[] }> {
    await this.ensureCanReadOrUpdateBoosterPackForUser(
      requestingUser,
      userId,
      'read',
    );

    const cards = this.boosterPackService.getCardsOfBoosterPack(boosterId);
    return { cards };
  }

  @Post('/:boosterId/booster-content/cards')
  async DrawBoosterPack(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('boosterId') boosterId: BoosterPack,
    @Body() cardIdsDto: CardIdsDto,
  ): Promise<{ cards: UserCard[] }> {
    const user = await this.ensureCanReadOrUpdateBoosterPackForUser(
      requestingUser,
      userId,
      'update',
    );

    const cards = this.boosterPackService.drawFromBoosterPack(
      user,
      boosterId,
      cardIdsDto,
    );
    return { cards };
  }

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

import { Controller, Get, Param } from '@nestjs/common';
import { ICard } from './card.interface';
import { CardService } from './card.service';
import { RequestUser } from '../request-user.decorator';
import { TrunkOfUser, User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { ObjectId } from '@mikro-orm/mongodb';
import { UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { UseInterceptors } from '@nestjs/common';
import { ContentInterceptor } from '../content-errors';
import { throwUnlessAuthorized } from '../auth/casl-helper';

@Controller(':userId/cards')
@UseGuards(BearerAuthGuard)
@UseInterceptors(ContentInterceptor)
export class CardController {
  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
  ) {}

  @Get('id')
  async GetCardById(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ): Promise<{ card: ICard }> {
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
}

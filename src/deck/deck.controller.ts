import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';
import { UserService } from '../user/user.service';
import { DeckService } from './deck.service';
import { RequestUser } from '../request-user.decorator';
import { DeckOfUser, User, UserDeck } from '../user/user.schema';
import { ObjectId } from '@mikro-orm/mongodb';
import { throwUnlessAuthorized } from '../auth/casl-helper';
import { IDeckContent } from './deck.interface';
import { CardContentIdsDto } from './deck.dto';

@CommonGuardedControllerDecorator('Decks', 'user/:userId/deck')
export class DeckController {
  constructor(
    private readonly userService: UserService,
    private readonly deckService: DeckService,
  ) {}

  @Get('/current-deck')
  async GetCurrentDeck(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ deck: UserDeck }> {
    const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(
      requestingUser,
      userId,
      'read',
    );

    const deck = this.deckService.getCurrentDeck(user);
    return { deck };
  }

  @Get('/decks')
  async GetAllDecks(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ decks: UserDeck[] }> {
    const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(
      requestingUser,
      userId,
      'read',
    );

    const decks = this.deckService.getDecks(user);
    return { decks };
  }

  @Get('/current-deck-contents')
  async GetCurrentDeckContents(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
  ): Promise<{ deck: IDeckContent }> {
    const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(
      requestingUser,
      userId,
      'read',
    );

    const deck = this.deckService.getCurrentDeckContents(user);
    return { deck };
  }

  @Post('/current-deck/update')
  async UpdateCurrentDeck(
    @RequestUser() requestingUser: User,
    @Param('userId') userId: string,
    @Body() cardContentIdsDto: CardContentIdsDto,
  ): Promise<{ deck: UserDeck }> {
    const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(
      requestingUser,
      userId,
      'read',
    );

    const deck = this.deckService.updateCurrentDeck(user, cardContentIdsDto);
    return { deck };
  }

  private async ensureCanReadOrUpdateCurrentDeckForUser(
    requestingUser: User,
    userId: string,
    intent: 'read' | 'update',
  ): Promise<User> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.currentDeck) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        ability.can(
          intent,
          new DeckOfUser(user.currentDeck, new ObjectId(userId)),
        ),
      );
    }
    return user;
  }

  private async ensureCanReadOrUpdateDecksForUser(
    requestingUser: User,
    userId: string,
    intent: 'read' | 'update',
  ): Promise<User> {
    const user = await this.userService.findByIdOrFail(new ObjectId(userId));

    if (user.decks) {
      throwUnlessAuthorized(requestingUser, (ability) =>
        user.decks.every((deck) =>
          ability.can(intent, new DeckOfUser(deck, new ObjectId(userId))),
        ),
      );
    }
    return user;
  }
}

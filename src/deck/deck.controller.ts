import { CommonGuardedControllerDecorator } from '../_util/decorators/compoundDecorators';
import { UserService } from '../user/user.service';
import { DeckService } from './deck.service';

@CommonGuardedControllerDecorator('Decks', 'user/:userId/deck')
export class DeckController {
  constructor(
    private readonly userService: UserService,
    private readonly deckService: DeckService,
  ) {}
}

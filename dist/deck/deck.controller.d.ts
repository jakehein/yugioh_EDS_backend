import { UserService } from '../user/user.service';
import { DeckService } from './deck.service';
import { User, UserDeck } from '../user/user.schema';
import { IDeckContent } from './deck.interface';
import { CardContentIdsDto } from './deck.dto';
export declare class DeckController {
    private readonly userService;
    private readonly deckService;
    constructor(userService: UserService, deckService: DeckService);
    GetCurrentDeck(requestingUser: User, userId: string): Promise<{
        deck: UserDeck;
    }>;
    GetAllDecks(requestingUser: User, userId: string): Promise<{
        decks: UserDeck[];
    }>;
    GetCurrentDeckContents(requestingUser: User, userId: string): Promise<{
        deck: IDeckContent;
    }>;
    UpdateCurrentDeck(requestingUser: User, userId: string, cardContentIdsDto: CardContentIdsDto): Promise<{
        deck: UserDeck;
    }>;
    private ensureCanReadOrUpdateCurrentDeckForUser;
    private ensureCanReadOrUpdateDecksForUser;
}

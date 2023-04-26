import { CardService } from '../card/card.service';
import { User, UserDeck, CardContentId } from '../user/user.schema';
import { IDeckContent } from './deck.interface';
import { UuidService } from '../uuid/uuid.service';
export declare class DeckService {
    private readonly cardService;
    private readonly uuidService;
    constructor(cardService: CardService, uuidService: UuidService);
    getCurrentDeck(user: User): UserDeck;
    getDecks(user: User): UserDeck[];
    getCurrentDeckContents(user: User): IDeckContent;
    updateCurrentDeck(user: User, cardContentIds: {
        cardContentIds: CardContentId[];
    }): UserDeck;
}

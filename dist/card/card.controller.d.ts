import { CardService } from './card.service';
import { User, UserCard } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { ICard } from './card.interface';
export declare class CardController {
    private readonly userService;
    private readonly cardService;
    constructor(userService: UserService, cardService: CardService);
    GetCardById(requestingUser: User, userId: string, cardId: string): Promise<{
        card: UserCard;
    }>;
    GetCardContent(requestingUser: User, userId: string, cardId: string): Promise<{
        card: ICard;
    }>;
    GetTrunk(requestingUser: User, userId: string): Promise<{
        trunk: UserCard[];
    }>;
    AddCardToTrunkById(requestingUser: User, userId: string, cardId: string): Promise<{
        card: UserCard;
    }>;
    AddCardToTrunkByPasscode(requestingUser: User, userId: string, passcode: string): Promise<{
        cards: UserCard[];
    }>;
    private ensureCanReadOrUpdateTrunkForUser;
}

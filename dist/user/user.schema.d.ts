import { ObjectId } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';
export declare type UserId = User['_id'];
export declare type CardContentId = string;
export declare class UserCard {
    id: string;
    contentId: string;
    copies: number;
    constructor(id: string, cardId: string, copies?: number);
}
export declare class UserDeck {
    id: string;
    name: string;
    cards: CardContentId[];
    constructor(id: string, name: string, cards?: CardContentId[]);
}
export declare class UserSideDeck {
    id: string;
    name: string;
    cards: CardContentId[];
    constructor(id: string, name: string, cards?: CardContentId[]);
}
export declare class UserBoosterPack {
    id: string;
    contentId: BoosterPack;
    isUnlocked: boolean;
    cardIds: UserCard[];
    constructor(id: string, boosterPackId: BoosterPack, cardIds?: UserCard[]);
}
export declare class User {
    _id: ObjectId;
    firebaseUId: string;
    accountId: string;
    name: string;
    authTime: number;
    trunk: UserCard[];
    decks: UserDeck[];
    sideDecks: UserSideDeck[];
    currentDeck: UserDeck;
    currentSideDeck: UserSideDeck;
    boostersAvailable: UserBoosterPack[];
    boostersCompleted: UserBoosterPack[];
    constructor(firebaseUId: string, accountId: string, name: string, authTime: number | undefined, boosters: {
        uuid: string;
        contentId: BoosterPack;
    }[], currentDeckId: string, currentSideDeckId: string);
}
declare abstract class WithOwner<TInner> {
    ownerId: User['_id'];
    inner: TInner;
    constructor(inner: TInner, ownerId: User['_id']);
}
export declare class TrunkOfUser extends WithOwner<UserCard> {
}
export declare class DeckOfUser extends WithOwner<UserDeck> {
}
export declare class SideDeckOfUser extends WithOwner<UserSideDeck> {
}
export declare class BoosterPackOfUser extends WithOwner<UserBoosterPack> {
}
export {};

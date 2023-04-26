import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
import { ContentAccessorService } from '../content/content-accessor.service';
import { ICard, ICardCopies } from './card.interface';
export declare class CardService {
    private readonly uuidService;
    private readonly contentAccessorService;
    constructor(uuidService: UuidService, contentAccessorService: ContentAccessorService);
    getCardContent(contentId: string): ICard;
    getTrunk(user: User): UserCard[];
    getTrunkContents(user: User): ICardCopies[];
    getCardFromTrunk(user: User, contentId: string): UserCard | null;
    addToTrunk(user: User, contentId: string): UserCard;
    addToTrunkByPasscode(user: User, passcode: string): UserCard[];
    checkBoostersCompletedForUser(user: User): UserBoosterPack[];
    private updateBoosterPackCard;
    getGeneralCardDataBasedOnPasscode(user: User, cardName: string): ICardCopies[];
}

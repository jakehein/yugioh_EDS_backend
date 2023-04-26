import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { BoosterPack, ICard } from '../card/card.interface';
import { IBoosterPack } from './booster-pack.interface';
import { CardService } from '../card/card.service';
export declare class BoosterPackService {
    private readonly contentAccessorService;
    private readonly cardService;
    constructor(contentAccessorService: ContentAccessorService, cardService: CardService);
    getAvailableBoosters(user: User): UserBoosterPack[];
    getUnlockedAvailableBoosters(user: User): UserBoosterPack[];
    unlockAvailableBooster(user: User, boosterId: BoosterPack): UserBoosterPack;
    getCompletedBoosters(user: User): UserBoosterPack[];
    getBoosterPackContent(boosterId: BoosterPack): IBoosterPack;
    getCardsOfBoosterPack(boosterId: BoosterPack): ICard[];
    drawFromBoosterPack(user: User, boosterId: BoosterPack, cardData: {
        cardIds: [string, string, string, string, string];
    }): UserCard[];
}

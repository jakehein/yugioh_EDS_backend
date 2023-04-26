import { BoosterPackService } from './booster-pack.service';
import { UserService } from '../user/user.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { BoosterPack, ICard } from '../card/card.interface';
import { IBoosterPack } from './booster-pack.interface';
import { CardIdsDto } from './booster-pack.dto';
export declare class BoosterPackController {
    private readonly userService;
    private readonly boosterPackService;
    constructor(userService: UserService, boosterPackService: BoosterPackService);
    GetAvailableBoosterPacks(requestingUser: User, userId: string): Promise<{
        boosterPacks: UserBoosterPack[];
    }>;
    GetCompletedBoosterPacks(requestingUser: User, userId: string): Promise<{
        boosterPacks: UserBoosterPack[];
    }>;
    GetBoosterPackContent(requestingUser: User, userId: string, boosterId: BoosterPack): Promise<{
        boosterPack: IBoosterPack;
    }>;
    GetBoosterPackContentCards(requestingUser: User, userId: string, boosterId: BoosterPack): Promise<{
        cards: ICard[];
    }>;
    DrawBoosterPack(requestingUser: User, userId: string, boosterId: BoosterPack, cardIdsDto: CardIdsDto): Promise<{
        cards: UserCard[];
    }>;
    private ensureCanReadOrUpdateBoosterPackForUser;
}

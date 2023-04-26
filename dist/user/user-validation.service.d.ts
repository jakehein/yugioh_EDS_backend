import { ContentAccessorService } from '../content/content-accessor.service';
import { User } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
export declare class UsersValidationService {
    private readonly contentAccessorService;
    private readonly uuidService;
    constructor(contentAccessorService: ContentAccessorService, uuidService: UuidService);
    validateUserFields(user: User): void;
    private validateAllCardsInTrunkExist;
    private validateAllBoosterPacksExist;
    private validateCardsExistOnBoosterPacksAvailable;
}

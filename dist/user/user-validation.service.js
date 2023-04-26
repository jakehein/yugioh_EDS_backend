"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersValidationService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const content_errors_1 = require("../content-errors");
const content_accessor_service_1 = require("../content/content-accessor.service");
const user_schema_1 = require("../user/user.schema");
const uuid_service_1 = require("../uuid/uuid.service");
let UsersValidationService = class UsersValidationService {
    constructor(contentAccessorService, uuidService) {
        this.contentAccessorService = contentAccessorService;
        this.uuidService = uuidService;
    }
    validateUserFields(user) {
        this.validateAllCardsInTrunkExist(user);
        this.validateAllBoosterPacksExist(user);
        this.validateCardsExistOnBoosterPacksAvailable(user);
    }
    validateAllCardsInTrunkExist(user) {
        if (user.trunk.length > 0) {
            const itemsNeedDeleting = user.trunk.filter((x) => !this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('cards', x.contentId));
            itemsNeedDeleting.forEach((x) => lodash_1.default.remove(user.trunk, x));
        }
    }
    validateAllBoosterPacksExist(user) {
        if (user.boostersAvailable.length > 0) {
            const itemsNeedDeleting = user.boostersAvailable.filter((x) => !this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('boosterPacks', x.contentId));
            itemsNeedDeleting.forEach((x) => lodash_1.default.remove(user.boostersAvailable, x));
        }
    }
    validateCardsExistOnBoosterPacksAvailable(user) {
        const boosterPacksAvailable = [];
        if (user.boostersAvailable.length > 0) {
            user.boostersAvailable.forEach((currentBoosterPack) => {
                const contentBoosterPack = this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('boosterPacks', currentBoosterPack.contentId);
                if (!contentBoosterPack)
                    throw new content_errors_1.BoosterPackNotFoundException(currentBoosterPack.contentId);
                if (currentBoosterPack.cardIds.length < 1) {
                    const cardIds = contentBoosterPack.cardIds.map((cardId) => {
                        const userCard = new user_schema_1.UserCard(this.uuidService.getUuid(), cardId);
                        const userCardInTrunk = user.trunk.find((card) => card.contentId === cardId);
                        if (userCardInTrunk) {
                            userCard.copies = userCardInTrunk.copies;
                        }
                        return userCard;
                    });
                    const userBoosterPack = new user_schema_1.UserBoosterPack(currentBoosterPack.id, currentBoosterPack.contentId, cardIds);
                    userBoosterPack.isUnlocked = currentBoosterPack.isUnlocked;
                    boosterPacksAvailable.push(userBoosterPack);
                }
                else {
                    boosterPacksAvailable.push(currentBoosterPack);
                }
            });
            user.boostersAvailable = boosterPacksAvailable;
        }
    }
};
UsersValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_accessor_service_1.ContentAccessorService,
        uuid_service_1.UuidService])
], UsersValidationService);
exports.UsersValidationService = UsersValidationService;
//# sourceMappingURL=user-validation.service.js.map
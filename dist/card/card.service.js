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
exports.CardService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("../user/user.schema");
const uuid_service_1 = require("../uuid/uuid.service");
const content_accessor_service_1 = require("../content/content-accessor.service");
const content_errors_1 = require("../content-errors");
let CardService = class CardService {
    constructor(uuidService, contentAccessorService) {
        this.uuidService = uuidService;
        this.contentAccessorService = contentAccessorService;
    }
    getCardContent(contentId) {
        const card = this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('cards', contentId);
        if (!card)
            throw new content_errors_1.CardNotFoundException(contentId);
        return card;
    }
    getTrunk(user) {
        return user.trunk;
    }
    getTrunkContents(user) {
        const trunkContent = [];
        const userTrunk = this.getTrunk(user);
        userTrunk.forEach((x) => {
            trunkContent.push(Object.assign(Object.assign({}, this.getCardContent(x.contentId)), { copies: x.copies }));
        });
        return trunkContent;
    }
    getCardFromTrunk(user, contentId) {
        var _a;
        return (_a = user.trunk.find((card) => card.contentId === contentId)) !== null && _a !== void 0 ? _a : null;
    }
    addToTrunk(user, contentId) {
        let card = this.getCardFromTrunk(user, contentId);
        if (card) {
            ++card.copies;
        }
        else if (this.getCardContent(contentId)) {
            const uuid = this.uuidService.getUuid();
            card = new user_schema_1.UserCard(uuid, contentId, 1);
            user.trunk.push(card);
        }
        else {
            throw new content_errors_1.CardNotFoundException(contentId);
        }
        this.updateBoosterPackCard(user, card);
        return card;
    }
    addToTrunkByPasscode(user, passcode) {
        const userCards = [];
        const contentCards = this.contentAccessorService.getAllContentCardsByPasscode(passcode);
        contentCards.forEach((card) => {
            const userCard = this.addToTrunk(user, card.id);
            userCards.push(userCard);
        });
        return userCards;
    }
    checkBoostersCompletedForUser(user) {
        const boostersAvailable = user.boostersAvailable;
        const boostersCompleted = user.boostersCompleted;
        return boostersAvailable.filter((currentBoosterPack) => {
            const unobtainedUserCard = currentBoosterPack.cardIds.find((x) => x.copies === 0);
            if (!unobtainedUserCard) {
                const completedBoosterPack = boostersCompleted.find((x) => x.contentId === currentBoosterPack.contentId);
                if (!completedBoosterPack) {
                    user.boostersCompleted.push(currentBoosterPack);
                    return true;
                }
            }
            return false;
        });
    }
    updateBoosterPackCard(user, card) {
        user.boostersAvailable.find((userBoosterPack) => {
            const boosterCard = userBoosterPack.cardIds.find((userCard) => userCard.contentId === card.contentId);
            if (!boosterCard) {
                throw new content_errors_1.BoosterPackDoesNotContainCardException(userBoosterPack.contentId, card.contentId);
            }
            ++boosterCard.copies;
        });
    }
    getGeneralCardDataBasedOnPasscode(user, cardName) {
        const cardContents = this.getTrunkContents(user);
        const cardsWithName = cardContents.filter((x) => x.name === cardName);
        const cardPasscodes = [];
        const cardsData = cardsWithName.filter((card) => {
            if (card.passcode && !cardPasscodes.includes(card.passcode)) {
                cardPasscodes.push(card.passcode);
                return true;
            }
            else {
                return false;
            }
        });
        return cardsData;
    }
};
CardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [uuid_service_1.UuidService,
        content_accessor_service_1.ContentAccessorService])
], CardService);
exports.CardService = CardService;
//# sourceMappingURL=card.service.js.map
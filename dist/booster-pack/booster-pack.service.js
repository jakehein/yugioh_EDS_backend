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
exports.BoosterPackService = void 0;
const common_1 = require("@nestjs/common");
const content_accessor_service_1 = require("../content/content-accessor.service");
const card_service_1 = require("../card/card.service");
const content_errors_1 = require("../content-errors");
let BoosterPackService = class BoosterPackService {
    constructor(contentAccessorService, cardService) {
        this.contentAccessorService = contentAccessorService;
        this.cardService = cardService;
    }
    getAvailableBoosters(user) {
        return user.boostersAvailable;
    }
    getUnlockedAvailableBoosters(user) {
        return user.boostersAvailable.filter((booster) => booster.isUnlocked);
    }
    unlockAvailableBooster(user, boosterId) {
        const userBoosterPack = user.boostersAvailable.find((booster) => booster.contentId === boosterId);
        if (!userBoosterPack) {
            throw new content_errors_1.BoosterPackNotFoundException(boosterId);
        }
        if (userBoosterPack.isUnlocked) {
            throw new content_errors_1.BoosterPackIsAlreadyUnlockedException(boosterId);
        }
        userBoosterPack.isUnlocked = !userBoosterPack.isUnlocked;
        return userBoosterPack;
    }
    getCompletedBoosters(user) {
        return user.boostersCompleted;
    }
    getBoosterPackContent(boosterId) {
        const boosterPack = this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('boosterPacks', boosterId);
        if (!boosterPack)
            throw new content_errors_1.BoosterPackNotFoundException(boosterId);
        return boosterPack;
    }
    getCardsOfBoosterPack(boosterId) {
        const cardIds = this.getBoosterPackContent(boosterId).cardIds;
        const cards = cardIds.map((cardId) => {
            const card = this.contentAccessorService.getContentEntryByIdAndContentTypeOptional('cards', cardId);
            if (!card)
                throw new content_errors_1.CardNotFoundException(cardId);
            return card;
        });
        return cards;
    }
    drawFromBoosterPack(user, boosterId, cardData) {
        const userCards = [];
        const boosterPack = this.getBoosterPackContent(boosterId);
        cardData.cardIds.forEach((cardId) => {
            if (!boosterPack.cardIds.includes(cardId)) {
                throw new content_errors_1.BoosterPackDoesNotContainCardException(boosterId, cardId);
            }
            userCards.push(this.cardService.addToTrunk(user, cardId));
        });
        return userCards;
    }
};
BoosterPackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_accessor_service_1.ContentAccessorService,
        card_service_1.CardService])
], BoosterPackService);
exports.BoosterPackService = BoosterPackService;
//# sourceMappingURL=booster-pack.service.js.map
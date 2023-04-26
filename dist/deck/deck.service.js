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
exports.DeckService = void 0;
const common_1 = require("@nestjs/common");
const card_service_1 = require("../card/card.service");
const user_schema_1 = require("../user/user.schema");
const card_interface_1 = require("../card/card.interface");
const uuid_service_1 = require("../uuid/uuid.service");
const content_errors_1 = require("../content-errors");
let DeckService = class DeckService {
    constructor(cardService, uuidService) {
        this.cardService = cardService;
        this.uuidService = uuidService;
    }
    getCurrentDeck(user) {
        const currentDeck = user.currentDeck;
        if (currentDeck.cards.length < 40) {
            throw new content_errors_1.InvalidDeckException(currentDeck.id, currentDeck.cards.length);
        }
        return currentDeck;
    }
    getDecks(user) {
        return user.decks;
    }
    getCurrentDeckContents(user) {
        const deck = this.getCurrentDeck(user);
        const deckData = {
            id: deck.id,
            name: deck.name,
            deckSize: 0,
            monsters: 0,
            traps: 0,
            spells: 0,
            fusionMonsters: 0,
            ritualMonsters: 0,
            cards: [],
        };
        deck.cards.forEach((cardContentId) => {
            const cardContent = this.cardService.getCardContent(cardContentId);
            switch (cardContent.cardType) {
                case card_interface_1.CardType.Monster:
                    if (cardContent.isFusionMonster) {
                        deckData.fusionMonsters++;
                    }
                    else if (cardContent.isRitualMonster) {
                        deckData.ritualMonsters++;
                    }
                    deckData.monsters++;
                    break;
                case card_interface_1.CardType.Spell:
                    deckData.spells++;
                    break;
                case card_interface_1.CardType.Trap:
                    deckData.traps++;
                    break;
            }
            if (!cardContent.isFusionMonster) {
                deckData.deckSize++;
            }
            deckData.cards.push(cardContent);
        });
        return deckData;
    }
    updateCurrentDeck(user, cardContentIds) {
        const cardsCopiesAllowed = new Map();
        cardContentIds.cardContentIds.forEach((cardContentId) => {
            const cardContent = this.cardService.getCardContent(cardContentId);
            const cardCopyAllowed = cardsCopiesAllowed.get(cardContent.name);
            if (!cardCopyAllowed) {
                if (cardContent.status === card_interface_1.Status.Forbidden) {
                    throw new content_errors_1.ForbiddenCardException(cardContentId);
                }
                cardsCopiesAllowed.set(cardContent.name, {
                    copies: 1,
                    allowedByStatus: card_interface_1.AllowedByStatus[cardContent.status],
                });
            }
            else {
                if (cardCopyAllowed.copies >= cardCopyAllowed.allowedByStatus) {
                    throw new content_errors_1.CardCopyLimitReachedException(cardCopyAllowed.allowedByStatus, cardContent.name);
                }
                cardCopyAllowed.copies++;
            }
        });
        const userDeck = new user_schema_1.UserDeck(this.uuidService.getUuid(), user.currentDeck.name, cardContentIds.cardContentIds);
        user.currentDeck = userDeck;
        return user.currentDeck;
    }
};
DeckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [card_service_1.CardService,
        uuid_service_1.UuidService])
], DeckService);
exports.DeckService = DeckService;
//# sourceMappingURL=deck.service.js.map
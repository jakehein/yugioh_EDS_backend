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
exports.BoosterPackOfUser = exports.SideDeckOfUser = exports.DeckOfUser = exports.TrunkOfUser = exports.User = exports.UserBoosterPack = exports.UserSideDeck = exports.UserDeck = exports.UserCard = void 0;
const core_1 = require("@mikro-orm/core");
const mongodb_1 = require("@mikro-orm/mongodb");
const card_interface_1 = require("../card/card.interface");
let UserCard = class UserCard {
    constructor(id, cardId, copies = 0) {
        this.id = id;
        this.contentId = cardId;
        this.copies = copies;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserCard.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserCard.prototype, "contentId", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], UserCard.prototype, "copies", void 0);
UserCard = __decorate([
    (0, core_1.Embeddable)(),
    __metadata("design:paramtypes", [String, String, Object])
], UserCard);
exports.UserCard = UserCard;
let UserDeck = class UserDeck {
    constructor(id, name, cards = []) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserDeck.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserDeck.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Array)
], UserDeck.prototype, "cards", void 0);
UserDeck = __decorate([
    (0, core_1.Embeddable)(),
    __metadata("design:paramtypes", [String, String, Array])
], UserDeck);
exports.UserDeck = UserDeck;
let UserSideDeck = class UserSideDeck {
    constructor(id, name, cards = []) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserSideDeck.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserSideDeck.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Array)
], UserSideDeck.prototype, "cards", void 0);
UserSideDeck = __decorate([
    (0, core_1.Embeddable)(),
    __metadata("design:paramtypes", [String, String, Array])
], UserSideDeck);
exports.UserSideDeck = UserSideDeck;
let UserBoosterPack = class UserBoosterPack {
    constructor(id, boosterPackId, cardIds = []) {
        this.isUnlocked = false;
        this.id = id;
        this.contentId = boosterPackId;
        this.cardIds = cardIds;
        switch (boosterPackId) {
            case card_interface_1.BoosterPack.DarkMagician:
            case card_interface_1.BoosterPack.MysticalElf:
            case card_interface_1.BoosterPack.RedEyesBDragon:
            case card_interface_1.BoosterPack.weeklyYuGiOh1:
            case card_interface_1.BoosterPack.weeklyYuGiOh2:
            case card_interface_1.BoosterPack.Magazine:
            case card_interface_1.BoosterPack.GrandpaCupQualifying:
            case card_interface_1.BoosterPack.GrandpaCupFinal:
                this.isUnlocked = true;
                break;
        }
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserBoosterPack.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserBoosterPack.prototype, "contentId", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Object)
], UserBoosterPack.prototype, "isUnlocked", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Array)
], UserBoosterPack.prototype, "cardIds", void 0);
UserBoosterPack = __decorate([
    (0, core_1.Embeddable)(),
    __metadata("design:paramtypes", [String, String, Array])
], UserBoosterPack);
exports.UserBoosterPack = UserBoosterPack;
let User = class User {
    constructor(firebaseUId, accountId, name, authTime = 0, boosters, currentDeckId, currentSideDeckId) {
        this.trunk = [];
        this.decks = [];
        this.sideDecks = [];
        this.boostersAvailable = [];
        this.boostersCompleted = [];
        this.firebaseUId = firebaseUId;
        this.accountId = accountId;
        this.name = name;
        this.authTime = authTime;
        this.currentDeck = new UserDeck(currentDeckId, 'Starter Deck', []);
        this.currentSideDeck = new UserSideDeck(currentSideDeckId, 'Starter Side Deck', []);
        boosters.forEach((booster) => this.boostersAvailable.push(new UserBoosterPack(booster.uuid, booster.contentId)));
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, core_1.Property)({ hidden: true }),
    (0, core_1.Unique)(),
    __metadata("design:type", String)
], User.prototype, "firebaseUId", void 0);
__decorate([
    (0, core_1.Property)(),
    (0, core_1.Unique)(),
    __metadata("design:type", String)
], User.prototype, "accountId", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ hidden: true }),
    __metadata("design:type", Number)
], User.prototype, "authTime", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserCard, { object: true, array: true }),
    __metadata("design:type", Array)
], User.prototype, "trunk", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserDeck, { object: true, array: true }),
    __metadata("design:type", Array)
], User.prototype, "decks", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserSideDeck, { object: true, array: true }),
    __metadata("design:type", Array)
], User.prototype, "sideDecks", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserDeck, { object: true }),
    __metadata("design:type", UserDeck)
], User.prototype, "currentDeck", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserSideDeck, { object: true }),
    __metadata("design:type", UserSideDeck)
], User.prototype, "currentSideDeck", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserBoosterPack, { object: true, array: true }),
    __metadata("design:type", Array)
], User.prototype, "boostersAvailable", void 0);
__decorate([
    (0, core_1.Embedded)(() => UserBoosterPack, { object: true, array: true }),
    __metadata("design:type", Array)
], User.prototype, "boostersCompleted", void 0);
User = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, Object, Array, String, String])
], User);
exports.User = User;
class WithOwner {
    constructor(inner, ownerId) {
        this.inner = inner;
        this.ownerId = ownerId;
    }
}
class TrunkOfUser extends WithOwner {
}
exports.TrunkOfUser = TrunkOfUser;
class DeckOfUser extends WithOwner {
}
exports.DeckOfUser = DeckOfUser;
class SideDeckOfUser extends WithOwner {
}
exports.SideDeckOfUser = SideDeckOfUser;
class BoosterPackOfUser extends WithOwner {
}
exports.BoosterPackOfUser = BoosterPackOfUser;
//# sourceMappingURL=user.schema.js.map
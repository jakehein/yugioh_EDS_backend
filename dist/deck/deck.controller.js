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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckController = void 0;
const decorators_1 = require("@nestjs/common/decorators");
const compoundDecorators_1 = require("../_util/decorators/compoundDecorators");
const user_service_1 = require("../user/user.service");
const deck_service_1 = require("./deck.service");
const request_user_decorator_1 = require("../request-user.decorator");
const user_schema_1 = require("../user/user.schema");
const mongodb_1 = require("@mikro-orm/mongodb");
const casl_helper_1 = require("../auth/casl-helper");
const deck_dto_1 = require("./deck.dto");
let DeckController = class DeckController {
    constructor(userService, deckService) {
        this.userService = userService;
        this.deckService = deckService;
    }
    async GetCurrentDeck(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(requestingUser, userId, 'read');
        const deck = this.deckService.getCurrentDeck(user);
        return { deck };
    }
    async GetAllDecks(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(requestingUser, userId, 'read');
        const decks = this.deckService.getDecks(user);
        return { decks };
    }
    async GetCurrentDeckContents(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(requestingUser, userId, 'read');
        const deck = this.deckService.getCurrentDeckContents(user);
        return { deck };
    }
    async UpdateCurrentDeck(requestingUser, userId, cardContentIdsDto) {
        const user = await this.ensureCanReadOrUpdateCurrentDeckForUser(requestingUser, userId, 'read');
        const deck = this.deckService.updateCurrentDeck(user, cardContentIdsDto);
        return { deck };
    }
    async ensureCanReadOrUpdateCurrentDeckForUser(requestingUser, userId, intent) {
        const user = await this.userService.findByIdOrFail(new mongodb_1.ObjectId(userId));
        if (user.currentDeck) {
            (0, casl_helper_1.throwUnlessAuthorized)(requestingUser, (ability) => ability.can(intent, new user_schema_1.DeckOfUser(user.currentDeck, new mongodb_1.ObjectId(userId))));
        }
        return user;
    }
    async ensureCanReadOrUpdateDecksForUser(requestingUser, userId, intent) {
        const user = await this.userService.findByIdOrFail(new mongodb_1.ObjectId(userId));
        if (user.decks) {
            (0, casl_helper_1.throwUnlessAuthorized)(requestingUser, (ability) => user.decks.every((deck) => ability.can(intent, new user_schema_1.DeckOfUser(deck, new mongodb_1.ObjectId(userId)))));
        }
        return user;
    }
};
__decorate([
    (0, decorators_1.Get)('/current-deck'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "GetCurrentDeck", null);
__decorate([
    (0, decorators_1.Get)('/decks'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "GetAllDecks", null);
__decorate([
    (0, decorators_1.Get)('/current-deck-contents'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "GetCurrentDeckContents", null);
__decorate([
    (0, decorators_1.Post)('/current-deck/update'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __param(2, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, deck_dto_1.CardContentIdsDto]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "UpdateCurrentDeck", null);
DeckController = __decorate([
    (0, compoundDecorators_1.CommonGuardedControllerDecorator)('Decks', 'user/:userId/deck'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        deck_service_1.DeckService])
], DeckController);
exports.DeckController = DeckController;
//# sourceMappingURL=deck.controller.js.map
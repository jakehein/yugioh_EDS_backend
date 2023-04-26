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
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const card_service_1 = require("./card.service");
const request_user_decorator_1 = require("../request-user.decorator");
const user_schema_1 = require("../user/user.schema");
const user_service_1 = require("../user/user.service");
const mongodb_1 = require("@mikro-orm/mongodb");
const casl_helper_1 = require("../auth/casl-helper");
const compoundDecorators_1 = require("../_util/decorators/compoundDecorators");
let CardController = class CardController {
    constructor(userService, cardService) {
        this.userService = userService;
        this.cardService = cardService;
    }
    async GetCardById(requestingUser, userId, cardId) {
        const user = await this.ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, 'read');
        const card = this.cardService.getCardFromTrunk(user, cardId);
        if (!card) {
            throw Error('placeholder error');
        }
        return { card };
    }
    async GetCardContent(requestingUser, userId, cardId) {
        await this.ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, 'read');
        return { card: this.cardService.getCardContent(cardId) };
    }
    async GetTrunk(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, 'read');
        const trunk = this.cardService.getTrunk(user);
        return { trunk };
    }
    async AddCardToTrunkById(requestingUser, userId, cardId) {
        const user = await this.ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, 'update');
        const card = this.cardService.addToTrunk(user, cardId);
        return { card };
    }
    async AddCardToTrunkByPasscode(requestingUser, userId, passcode) {
        const user = await this.ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, 'update');
        const cards = this.cardService.addToTrunkByPasscode(user, passcode);
        return { cards };
    }
    async ensureCanReadOrUpdateTrunkForUser(requestingUser, userId, intent) {
        const user = await this.userService.findByIdOrFail(new mongodb_1.ObjectId(userId));
        if (user.trunk) {
            (0, casl_helper_1.throwUnlessAuthorized)(requestingUser, (ability) => user.trunk.every((card) => ability.can(intent, new user_schema_1.TrunkOfUser(card, new mongodb_1.ObjectId(userId)))));
        }
        return user;
    }
};
__decorate([
    (0, common_1.Get)(':cardId'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "GetCardById", null);
__decorate([
    (0, common_1.Get)(':cardId/card-content'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "GetCardContent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "GetTrunk", null);
__decorate([
    (0, common_1.Post)(':cardId/add-card-by-id'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "AddCardToTrunkById", null);
__decorate([
    (0, common_1.Post)(':passcode/add-card-by-passcode'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('passcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "AddCardToTrunkByPasscode", null);
CardController = __decorate([
    (0, compoundDecorators_1.CommonGuardedControllerDecorator)('Cards', 'user/:userId/cards'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        card_service_1.CardService])
], CardController);
exports.CardController = CardController;
//# sourceMappingURL=card.controller.js.map
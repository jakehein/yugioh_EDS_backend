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
exports.BoosterPackController = void 0;
const booster_pack_service_1 = require("./booster-pack.service");
const user_service_1 = require("../user/user.service");
const compoundDecorators_1 = require("../_util/decorators/compoundDecorators");
const user_schema_1 = require("../user/user.schema");
const mongodb_1 = require("@mikro-orm/mongodb");
const casl_helper_1 = require("../auth/casl-helper");
const request_user_decorator_1 = require("../request-user.decorator");
const decorators_1 = require("@nestjs/common/decorators");
const card_interface_1 = require("../card/card.interface");
const booster_pack_dto_1 = require("./booster-pack.dto");
let BoosterPackController = class BoosterPackController {
    constructor(userService, boosterPackService) {
        this.userService = userService;
        this.boosterPackService = boosterPackService;
    }
    async GetAvailableBoosterPacks(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, 'read');
        const boosterPacks = this.boosterPackService.getAvailableBoosters(user);
        return { boosterPacks };
    }
    async GetCompletedBoosterPacks(requestingUser, userId) {
        const user = await this.ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, 'read');
        const boosterPacks = this.boosterPackService.getCompletedBoosters(user);
        return { boosterPacks };
    }
    async GetBoosterPackContent(requestingUser, userId, boosterId) {
        await this.ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, 'read');
        const boosterPack = this.boosterPackService.getBoosterPackContent(boosterId);
        return { boosterPack };
    }
    async GetBoosterPackContentCards(requestingUser, userId, boosterId) {
        await this.ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, 'read');
        const cards = this.boosterPackService.getCardsOfBoosterPack(boosterId);
        return { cards };
    }
    async DrawBoosterPack(requestingUser, userId, boosterId, cardIdsDto) {
        const user = await this.ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, 'update');
        const cards = this.boosterPackService.drawFromBoosterPack(user, boosterId, cardIdsDto);
        return { cards };
    }
    async ensureCanReadOrUpdateBoosterPackForUser(requestingUser, userId, intent) {
        const user = await this.userService.findByIdOrFail(new mongodb_1.ObjectId(userId));
        if (user.boostersAvailable) {
            (0, casl_helper_1.throwUnlessAuthorized)(requestingUser, (ability) => user.boostersAvailable.every((boosterPack) => ability.can(intent, new user_schema_1.BoosterPackOfUser(boosterPack, new mongodb_1.ObjectId(userId)))));
        }
        return user;
    }
};
__decorate([
    (0, decorators_1.Get)('/available'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], BoosterPackController.prototype, "GetAvailableBoosterPacks", null);
__decorate([
    (0, decorators_1.Get)('/completed'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], BoosterPackController.prototype, "GetCompletedBoosterPacks", null);
__decorate([
    (0, decorators_1.Get)('/:boosterId/booster-content'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __param(2, (0, decorators_1.Param)('boosterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], BoosterPackController.prototype, "GetBoosterPackContent", null);
__decorate([
    (0, decorators_1.Get)('/:boosterId/booster-content/cards'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __param(2, (0, decorators_1.Param)('boosterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], BoosterPackController.prototype, "GetBoosterPackContentCards", null);
__decorate([
    (0, decorators_1.Post)('/:boosterId/booster-content/cards'),
    __param(0, (0, request_user_decorator_1.RequestUser)()),
    __param(1, (0, decorators_1.Param)('userId')),
    __param(2, (0, decorators_1.Param)('boosterId')),
    __param(3, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String, booster_pack_dto_1.CardIdsDto]),
    __metadata("design:returntype", Promise)
], BoosterPackController.prototype, "DrawBoosterPack", null);
BoosterPackController = __decorate([
    (0, compoundDecorators_1.CommonGuardedControllerDecorator)('Booster Packs', 'user/:userId/booster-pack'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        booster_pack_service_1.BoosterPackService])
], BoosterPackController);
exports.BoosterPackController = BoosterPackController;
//# sourceMappingURL=booster-pack.controller.js.map
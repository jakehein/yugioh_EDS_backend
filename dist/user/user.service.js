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
exports.UserService = exports.generateAccountId = exports.UserExistsError = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const zoo_ids_1 = require("zoo-ids");
const async_1 = require("nanoid/async");
const user_schema_1 = require("./user.schema");
const assert = require("assert");
const nestjs_1 = require("@mikro-orm/nestjs");
const user_validation_service_1 = require("../user/user-validation.service");
const card_interface_1 = require("../card/card.interface");
const uuid_service_1 = require("../uuid/uuid.service");
class UserExistsError extends Error {
    constructor(firebaseUId) {
        super();
        this.firebaseUId = firebaseUId;
        this.name = 'UserExistsError';
    }
}
exports.UserExistsError = UserExistsError;
async function generateAccountId() {
    const nanoid = (0, async_1.customAlphabet)('0123456789', 12);
    const baseString = await nanoid();
    const m = /^(\d{4})(\d{4})(\d{4})$/i.exec(baseString);
    assert(m);
    return `${m[1]}-${m[2]}-${m[3]}`;
}
exports.generateAccountId = generateAccountId;
let UserService = class UserService {
    constructor(userRepository, usersValidationService, uuidService) {
        this.userRepository = userRepository;
        this.usersValidationService = usersValidationService;
        this.uuidService = uuidService;
    }
    async createFromFirebase(firebaseUId, authTime) {
        const accountId = await generateAccountId();
        const name = (0, zoo_ids_1.generateId)();
        const boosters = [];
        Object.values(card_interface_1.BoosterPack).forEach((boosterPack) => {
            boosters.push({
                uuid: this.uuidService.getUuid(),
                contentId: boosterPack,
            });
        });
        const user = new user_schema_1.User(firebaseUId, accountId, name, authTime, boosters, this.uuidService.getUuid(), this.uuidService.getUuid());
        try {
            await this.userRepository.persistAndFlush(user);
            return user;
        }
        catch (e) {
            if (e instanceof core_1.UniqueConstraintViolationException) {
                const uniqueE = e;
                if (uniqueE.keyValue && uniqueE.keyValue.firebaseUId === firebaseUId) {
                    throw new UserExistsError(firebaseUId);
                }
            }
            throw e;
        }
    }
    async findById(userId) {
        const user = await this.userRepository.findOne(userId);
        if (user)
            this.usersValidationService.validateUserFields(user);
        return user;
    }
    async findByIdOrFail(userId) {
        const user = await this.userRepository.findOneOrFail(userId);
        this.usersValidationService.validateUserFields(user);
        return user;
    }
    async findByFirebaseUId(firebaseUId) {
        const user = await this.userRepository.findOne({ firebaseUId });
        if (user)
            this.usersValidationService.validateUserFields(user);
        return user;
    }
    async findByAccountIdOrFail(accountId) {
        const user = await this.userRepository.findOneOrFail({ accountId });
        this.usersValidationService.validateUserFields(user);
        return user;
    }
    async findByAccountId(accountId) {
        const user = await this.userRepository.findOne({ accountId });
        if (user)
            this.usersValidationService.validateUserFields(user);
        return user;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(user_schema_1.User)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        user_validation_service_1.UsersValidationService,
        uuid_service_1.UuidService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
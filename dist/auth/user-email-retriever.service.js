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
exports.UserEmailRetrieverService = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("firebase-admin/auth");
const Either_1 = require("fp-ts/Either");
const function_1 = require("fp-ts/function");
const io_ts_extra_codecs_1 = require("../io-ts-extra-codecs");
let UserEmailRetrieverService = class UserEmailRetrieverService {
    constructor(firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }
    async getUserEmailFromFirebaseUId(firebaseUId) {
        const firebaseUser = await this.firebaseAuth.getUser(firebaseUId);
        if (!firebaseUser.email)
            return null;
        return (0, function_1.pipe)(io_ts_extra_codecs_1.email.decode(firebaseUser.email), (0, Either_1.match)(() => {
            throw new Error('Email address returned from Firebase is somehow not a valid email address');
        }, function_1.identity));
    }
};
UserEmailRetrieverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIREBASE_ADMIN_AUTH')),
    __metadata("design:paramtypes", [auth_1.Auth])
], UserEmailRetrieverService);
exports.UserEmailRetrieverService = UserEmailRetrieverService;
//# sourceMappingURL=user-email-retriever.service.js.map
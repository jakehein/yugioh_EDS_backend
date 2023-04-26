"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentInterceptor = exports.InvalidDeckException = exports.CardCopyLimitReachedException = exports.ForbiddenCardException = exports.BoosterPackDoesNotContainCardException = exports.CardNotFoundException = exports.BoosterPackIsAlreadyUnlockedException = exports.BoosterPackNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const error_helpers_1 = require("./error-helpers");
class BoosterPackNotFoundException extends Error {
    constructor(boosterPackId) {
        super(`BoosterPack of id ${boosterPackId} was not found`);
    }
}
exports.BoosterPackNotFoundException = BoosterPackNotFoundException;
class BoosterPackIsAlreadyUnlockedException extends Error {
    constructor(boosterPackId) {
        super(`BoosterPack of id ${boosterPackId} is already unlocked`);
    }
}
exports.BoosterPackIsAlreadyUnlockedException = BoosterPackIsAlreadyUnlockedException;
class CardNotFoundException extends Error {
    constructor(cardId) {
        super(`Card of id ${cardId} was not found`);
    }
}
exports.CardNotFoundException = CardNotFoundException;
class BoosterPackDoesNotContainCardException extends Error {
    constructor(boosterPackId, cardId) {
        super(`Card of id ${cardId} is not in BoosterPack of id ${boosterPackId}`);
    }
}
exports.BoosterPackDoesNotContainCardException = BoosterPackDoesNotContainCardException;
class ForbiddenCardException extends Error {
    constructor(cardId) {
        super(`${cardId} is a forbidden card`);
    }
}
exports.ForbiddenCardException = ForbiddenCardException;
class CardCopyLimitReachedException extends Error {
    constructor(allowedByStatus, cardName) {
        super(`Only allowed to add ${allowedByStatus} copies of ${cardName}`);
    }
}
exports.CardCopyLimitReachedException = CardCopyLimitReachedException;
class InvalidDeckException extends Error {
    constructor(deckId, count) {
        super(`Deck with id ${deckId} has ${count} / 40 cards`);
    }
}
exports.InvalidDeckException = InvalidDeckException;
let ContentInterceptor = class ContentInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, error_helpers_1.handleError)(BoosterPackNotFoundException, (err) => new common_1.NotFoundException(err.message)), (0, error_helpers_1.handleError)(BoosterPackIsAlreadyUnlockedException, (err) => new common_1.BadRequestException(err.message)), (0, error_helpers_1.handleError)(CardNotFoundException, (err) => new common_1.NotFoundException(err.message)), (0, error_helpers_1.handleError)(BoosterPackDoesNotContainCardException, (err) => new common_1.NotFoundException(err.message)), (0, error_helpers_1.handleError)(ForbiddenCardException, (err) => new common_1.BadRequestException(err.message)), (0, error_helpers_1.handleError)(CardCopyLimitReachedException, (err) => new common_1.BadRequestException(err.message)), (0, error_helpers_1.handleError)(InvalidDeckException, (err) => new common_1.BadRequestException(err.message)));
    }
};
ContentInterceptor = __decorate([
    (0, common_1.Injectable)()
], ContentInterceptor);
exports.ContentInterceptor = ContentInterceptor;
//# sourceMappingURL=content-errors.js.map
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class BoosterPackNotFoundException extends Error {
    constructor(boosterPackId: string);
}
export declare class BoosterPackIsAlreadyUnlockedException extends Error {
    constructor(boosterPackId: string);
}
export declare class CardNotFoundException extends Error {
    constructor(cardId: string);
}
export declare class BoosterPackDoesNotContainCardException extends Error {
    constructor(boosterPackId: string, cardId: string);
}
export declare class ForbiddenCardException extends Error {
    constructor(cardId: string);
}
export declare class CardCopyLimitReachedException extends Error {
    constructor(allowedByStatus: number, cardName: string);
}
export declare class InvalidDeckException extends Error {
    constructor(deckId: string, count: number);
}
export declare class ContentInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}

import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { handleError } from './error-helpers';

export class BoosterPackNotFoundException extends Error {
  constructor(boosterPackId: string) {
    super(`BoosterPack of id ${boosterPackId} was not found`);
  }
}

export class BoosterPackIsAlreadyUnlockedException extends Error {
  constructor(boosterPackId: string) {
    super(`BoosterPack of id ${boosterPackId} is already unlocked`);
  }
}

export class CardNotFoundException extends Error {
  constructor(cardId: string) {
    super(`Card of id ${cardId} was not found`);
  }
}

export class BoosterPackDoesNotContainCardException extends Error {
  constructor(boosterPackId: string, cardId: string) {
    super(`Card of id ${cardId} is not in BoosterPack of id ${boosterPackId}`);
  }
}

export class ForbiddenCardException extends Error {
  constructor(cardId: string) {
    super(`${cardId} is a forbidden card`);
  }
}

export class CardCopyLimitReachedException extends Error {
  constructor(allowedByStatus: number, cardName: string) {
    super(`Only allowed to add ${allowedByStatus} copies of ${cardName}`);
  }
}

export class InvalidDeckException extends Error {
  constructor(deckId: string, count: number) {
    super(`Deck with id ${deckId} has ${count} / 40 cards`);
  }
}

@Injectable()
export class ContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      handleError(
        BoosterPackNotFoundException,
        (err) => new NotFoundException(err.message),
      ),
      handleError(
        BoosterPackIsAlreadyUnlockedException,
        (err) => new BadRequestException(err.message),
      ),
      handleError(
        CardNotFoundException,
        (err) => new NotFoundException(err.message),
      ),
      handleError(
        BoosterPackDoesNotContainCardException,
        (err) => new NotFoundException(err.message),
      ),
      handleError(
        ForbiddenCardException,
        (err) => new BadRequestException(err.message),
      ),
      handleError(
        CardCopyLimitReachedException,
        (err) => new BadRequestException(err.message),
      ),
      handleError(
        InvalidDeckException,
        (err) => new BadRequestException(err.message),
      ),
    );
  }
}

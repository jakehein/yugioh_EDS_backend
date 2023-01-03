import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { handleError } from '../error-helpers';

// TODO: use this skeleton to make meaningful error catching
export class TestException extends Error {
  constructor(test: unknown) {
    super(`This is a test exception where ${test} caused an issue`);
  }
}

export class GenericNotFoundException extends Error {}

@Injectable()
export class UserContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      handleError(TestException, (err) => new BadRequestException(err.message)),
      handleError(
        GenericNotFoundException,
        () => new NotFoundException('some message'),
      ),
    );
  }
}

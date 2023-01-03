import { Type } from '@nestjs/common';
import { catchError } from 'rxjs';

export function handleError<T extends Error, U>(
  errorClass: Type<T>,
  cb: (error: T) => U,
) {
  return catchError((err) => {
    if (err instanceof errorClass) {
      throw cb(err);
    }

    throw err;
  });
}

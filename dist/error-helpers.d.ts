import { Type } from '@nestjs/common';
export declare function handleError<T extends Error, U>(errorClass: Type<T>, cb: (error: T) => U): import("rxjs").OperatorFunction<unknown, unknown>;

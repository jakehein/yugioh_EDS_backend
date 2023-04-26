import { EntityManager } from '@mikro-orm/mongodb';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class FlushInterceptor implements NestInterceptor {
    private em;
    constructor(em: EntityManager);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}

/// <reference types="jest" />
import { EntityRepository } from '@mikro-orm/core';
import { Either, Left, Right } from 'fp-ts/lib/Either';
import { ObjectId } from 'mongodb';
export interface RepoMockMethods<E> {
    add(e: E): void;
}
export declare type RepoMock<E extends {
    _id: ObjectId;
}> = Partial<EntityRepository<E>> & RepoMockMethods<E>;
export declare class MikroOrmRepositoryMock<E extends {
    _id: ObjectId;
}> implements RepoMock<E> {
    private entries;
    constructor();
    add(e: E): void;
    findAllEntries(): Promise<E[]>;
    findOneEntryOrFail(id: any): Promise<E>;
    findOneEntry(id: any): Promise<E | null>;
    remove(e: E): any;
    persist(e: E): any;
}
export declare type RepoMockWithFlush<E extends {
    _id: ObjectId;
}> = RepoMock<E> & RepoMockWithFlushMethods<E>;
export interface RepoMockWithFlushMethods<E extends {
    _id: ObjectId;
}> {
    flush: jest.MockedFunction<EntityRepository<E>['flush']>;
}
export declare class MikroOrmRepositoryWithFlushMock<E extends {
    _id: ObjectId;
}> extends MikroOrmRepositoryMock<E> implements RepoMockWithFlushMethods<E> {
    flush: jest.MockedFunction<EntityRepository<E>['flush']>;
    constructor();
}
export declare function makePartial<T>(ps: Partial<T>): T;
export declare function expectIsRight<E, A>(value: Either<E, A>): asserts value is Right<A>;
export declare function expectIsLeft<E, A>(value: Either<E, A>): asserts value is Left<E>;
export declare type PartialReturn<T> = T extends (...args: infer A) => infer R ? (...args: A) => Partial<R> : never;

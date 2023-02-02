import { EntityRepository } from '@mikro-orm/core';
import { Either, Left, Right } from 'fp-ts/lib/Either';
import { ObjectId } from 'mongodb';

export interface RepoMockMethods<E> {
  add(e: E): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RepoMock<E extends { _id: ObjectId }> = Partial<
  EntityRepository<E>
> &
  RepoMockMethods<E>;

export class MikroOrmRepositoryMock<E extends { _id: ObjectId }>
  implements RepoMock<E>
{
  private entries: E[];

  constructor() {
    this.entries = [];
  }

  add(e: E) {
    this.entries.push(e);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAllEntries() {
    return this.entries;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findOneEntryOrFail(id: any) {
    const e = this.entries.find((e) => e._id.equals(id));
    if (!e) throw new Error('cannot find entry');
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await e;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findOneEntry(id: any) {
    const e = this.entries.find((e) => e._id.equals(id));
    if (!e) return null;
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await e;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(e: E): any {
    this.entries = this.entries.filter((checkEntry) => checkEntry !== e);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  persist(e: E): any {
    this.entries.push(e);
  }
}

export type RepoMockWithFlush<E extends { _id: ObjectId }> = RepoMock<E> &
  RepoMockWithFlushMethods<E>;

export interface RepoMockWithFlushMethods<E extends { _id: ObjectId }> {
  flush: jest.MockedFunction<EntityRepository<E>['flush']>;
}

export class MikroOrmRepositoryWithFlushMock<E extends { _id: ObjectId }>
  extends MikroOrmRepositoryMock<E>
  implements RepoMockWithFlushMethods<E>
{
  flush: jest.MockedFunction<EntityRepository<E>['flush']>;

  constructor() {
    super();

    this.flush = jest.fn();
  }
}

const objectThatRaisesExceptionOnAnyPropertyAccess: object = new Proxy(
  {},
  {
    get(_target, p) {
      if (
        [
          Symbol.toStringTag,
          Symbol.iterator,
          Symbol.for('nodejs.util.inspect.custom'),
          'constructor',
          'length',
          'then',
        ].includes(p)
      )
        return undefined;

      throw new Error(
        `Accessing property '${String(p)}' that should not be accessed`,
      );
    },
  },
);

export function makePartial<T>(ps: Partial<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _ = require('lodash');
  const out = _.clone(ps);

  Object.setPrototypeOf(out, objectThatRaisesExceptionOnAnyPropertyAccess);

  return out as T;
}

export function expectIsRight<E, A>(
  value: Either<E, A>,
): asserts value is Right<A> {
  expect(value).toStrictEqual({
    _tag: 'Right',
    right: expect.anything(),
  });
}

export function expectIsLeft<E, A>(
  value: Either<E, A>,
): asserts value is Left<E> {
  expect(value).toStrictEqual({
    _tag: 'Left',
    left: expect.anything(),
  });
}

export type PartialReturn<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Partial<R>
  : never;

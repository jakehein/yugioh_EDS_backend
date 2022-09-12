import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Embeddable()
export class UserDeck {
  @Property()
  id: string;

  constructor(deckId: string) {
    this.id = deckId;
  }
}

@Embeddable()
export class UserSideDeck {
  @Property()
  id: string;

  constructor(deckSideId: string) {
    this.id = deckSideId;
  }
}

@Embeddable()
export class UserBoosterPack {
  @Property()
  id: string;

  constructor(boosterPackId: string) {
    this.id = boosterPackId;
  }
}

@Entity()
export class User {
  @PrimaryKey()
  _id!: string;

  @Property()
  @Unique()
  accountId: string;

  @Property()
  name: string;

  @Embedded(() => UserDeck, { object: true, array: true })
  decks: UserDeck[] = [];

  @Embedded(() => UserSideDeck, { object: true, array: true })
  sideDecks: UserSideDeck[] = [];

  @Embedded(() => UserDeck, { object: true, array: true, nullable: true })
  currentDeck: UserDeck;

  @Embedded(() => UserSideDeck, { object: true, array: true, nullable: true })
  currentSideDeck: UserSideDeck;

  @Embedded(() => UserBoosterPack, { object: true, array: true })
  boostersAvailable: UserBoosterPack[] = [];

  @Embedded(() => UserBoosterPack, { object: true, array: true })
  boostersCompleted: UserBoosterPack[] = [];

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}

// UserDeck, UserSideDeck, and UserBoosterPack are embedded into user, so they have no field actually referencing their owner
// this class wraps the models with such a reference
// this is exclusively used together with casl.js so we can define rules based on the owner id
abstract class WithOwner<TInner> {
  ownerId: User['_id'];
  inner: TInner;

  constructor(inner: TInner, ownerId: User['_id']) {
    this.inner = inner;
    this.ownerId = ownerId;
  }
}

export class DeckOfUser extends WithOwner<UserDeck> {}
export class SideDeckOfUser extends WithOwner<UserSideDeck> {}
export class BoosterPackOfUser extends WithOwner<UserBoosterPack> {}

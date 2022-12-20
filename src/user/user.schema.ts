import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export type UserId = User['_id'];

@Embeddable()
export class UserCard {
  @Property()
  contentId: string;

  constructor(cardId: string) {
    this.contentId = cardId;
  }
}

@Embeddable()
export class UserDeck {
  @Property()
  contentId: string;

  constructor(deckId: string) {
    this.contentId = deckId;
  }
}

@Embeddable()
export class UserSideDeck {
  @Property()
  contentId: string;

  constructor(deckSideId: string) {
    this.contentId = deckSideId;
  }
}

@Embeddable()
export class UserBoosterPack {
  @Property()
  contentId: string;

  constructor(boosterPackId: string) {
    this.contentId = boosterPackId;
  }
}

@Entity()
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ hidden: true })
  @Unique()
  firebaseUId: string;

  @Property()
  @Unique()
  accountId: string;

  @Property()
  name: string;

  @Property({ hidden: true })
  authTime: number;

  @Embedded(() => UserDeck, { object: true, array: true })
  trunk: UserCard[] = [];

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

  constructor(
    firebaseUId: string,
    accountId: string,
    name: string,
    authTime = 0,
  ) {
    this.firebaseUId = firebaseUId;
    this.accountId = accountId;
    this.name = name;
    this.authTime = authTime;
  }
}

// UserCard, UserDeck, UserSideDeck, and UserBoosterPack are embedded into user, so they have no field actually referencing their owner
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

export class TrunkOfUser extends WithOwner<UserCard> {}
export class DeckOfUser extends WithOwner<UserDeck> {}
export class SideDeckOfUser extends WithOwner<UserSideDeck> {}
export class BoosterPackOfUser extends WithOwner<UserBoosterPack> {}

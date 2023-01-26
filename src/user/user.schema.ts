import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';

export type UserId = User['_id'];

@Embeddable()
export class UserCard {
  @Property()
  id: string;

  @Property()
  contentId: string;

  @Property()
  copies: number;

  constructor(id: string, cardId: string, copies = 0) {
    this.id = id;
    this.contentId = cardId;
    this.copies = copies;
  }
}

@Embeddable()
export class UserDeck {
  @Property()
  id: string;

  @Property()
  name: string;

  //need to be based on cardName, not id
  @Property()
  cards: string[];

  constructor(id: string, name: string, cards: string[] = []) {
    this.id = id;
    this.name = name;
    this.cards = cards;
  }
}

@Embeddable()
export class UserSideDeck {
  @Property()
  id: string;

  @Property()
  name: string;

  //TODO: enforce only 15 allowed per SideDeck
  //need to be based on cardName, not id
  @Property()
  cards: string[];

  constructor(id: string, name: string, cards: string[] = []) {
    this.id = id;
    this.name = name;
    this.cards = cards;
  }
}

@Embeddable()
export class UserBoosterPack {
  @Property()
  id: string;

  @Property()
  contentId: BoosterPack;

  @Property()
  isUnlocked = false;

  @Property()
  cardIds: UserCard[];

  constructor(
    id: string,
    boosterPackId: BoosterPack,
    cardIds: UserCard[] = [],
  ) {
    this.id = id;
    this.contentId = boosterPackId;
    this.cardIds = cardIds;

    switch (boosterPackId) {
      case BoosterPack.DarkMagician:
      case BoosterPack.MysticalElf:
      case BoosterPack.RedEyesBDragon:
      case BoosterPack.weeklyYuGiOh1:
      case BoosterPack.weeklyYuGiOh2:
      case BoosterPack.Magazine:
      case BoosterPack.GrandpaCupQualifying:
      case BoosterPack.GrandpaCupFinal:
        this.isUnlocked = true;
        break;
    }
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

  @Embedded(() => UserCard, { object: true, array: true })
  trunk: UserCard[] = [];

  @Embedded(() => UserDeck, { object: true, array: true })
  decks: UserDeck[] = [];

  @Embedded(() => UserSideDeck, { object: true, array: true })
  sideDecks: UserSideDeck[] = [];

  @Embedded(() => UserDeck, { object: true })
  currentDeck: UserDeck;

  @Embedded(() => UserSideDeck, { object: true })
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
    boosters: { uuid: string; contentId: BoosterPack }[],
    currentDeckId: string,
    currentSideDeckId: string,
  ) {
    this.firebaseUId = firebaseUId;
    this.accountId = accountId;
    this.name = name;
    this.authTime = authTime;
    this.currentDeck = new UserDeck(currentDeckId, 'Starter Deck', []);
    this.currentSideDeck = new UserSideDeck(
      currentSideDeckId,
      'Starter Side Deck',
      [],
    );
    boosters.forEach((booster: { uuid: string; contentId: BoosterPack }) =>
      this.boostersAvailable.push(
        new UserBoosterPack(booster.uuid, booster.contentId),
      ),
    );
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

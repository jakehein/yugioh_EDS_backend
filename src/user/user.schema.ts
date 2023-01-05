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
  copies = 1;

  constructor(id: string, cardId: string) {
    this.id = id;
    this.contentId = cardId;
  }
}

//TODO: Need to probably have an id on this?
@Embeddable()
export class UserDeck {
  @Property()
  deckId = '1';

  @Property({ nullable: true })
  cards?: UserCard[];
}

//TODO: Need to probably have an id on this?
@Embeddable()
export class UserSideDeck {
  @Property()
  sideDeckId = '1';

  @Property({ nullable: true })
  cards?: UserCard[];
}

@Embeddable()
export class UserBoosterPack {
  @Property()
  id: string;

  @Property()
  contentId: string;

  @Property()
  isUnlocked = false;

  constructor(id: string, boosterPackId: string) {
    this.id = id;
    this.contentId = boosterPackId;

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

  @Embedded(() => UserDeck, { object: true, array: true })
  currentDeck: UserDeck = new UserDeck();

  @Embedded(() => UserSideDeck, { object: true, array: true })
  currentSideDeck: UserSideDeck = new UserSideDeck();

  @Embedded(() => UserBoosterPack, { object: true, array: true })
  boostersAvailable: UserBoosterPack[] = [];

  @Embedded(() => UserBoosterPack, { object: true, array: true })
  boostersCompleted: UserBoosterPack[] = [];

  constructor(
    firebaseUId: string,
    accountId: string,
    name: string,
    authTime = 0,
    boosters: { uuid: string; contentId: string }[],
  ) {
    this.firebaseUId = firebaseUId;
    this.accountId = accountId;
    this.name = name;
    this.authTime = authTime;
    boosters.forEach((booster: { uuid: string; contentId: string }) =>
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

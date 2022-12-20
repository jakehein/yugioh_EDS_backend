import { Entity, Property } from '@mikro-orm/core';
import { BaseRecord } from './base-record.schema';
import { ObjectId } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';

@Entity({ collection: 'log-booster-pull-record' })
export class BoosterPullRecord extends BaseRecord {
  @Property()
  userId: ObjectId;

  @Property()
  pulledOn: Date;

  @Property()
  PackPulledFrom: BoosterPack;

  @Property()
  cardIds: string[];

  constructor(
    userId: ObjectId,
    PackPulledFrom: BoosterPack,
    cardIds: string[],
  ) {
    super(new ObjectId());
    this.userId = userId;
    this.pulledOn = new Date();
    this.PackPulledFrom = PackPulledFrom;
    this.cardIds = cardIds;
  }
}

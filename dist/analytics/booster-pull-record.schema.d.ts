import { BaseRecord } from './base-record.schema';
import { ObjectId } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';
export declare class BoosterPullRecord extends BaseRecord {
    userId: ObjectId;
    pulledOn: Date;
    PackPulledFrom: BoosterPack;
    cardIds: string[];
    constructor(userId: ObjectId, PackPulledFrom: BoosterPack, cardIds: string[]);
}

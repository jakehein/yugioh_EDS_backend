import { BoosterPullRecord } from './booster-pull-record.schema';
import { EntityRepository } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';
import { User } from '../user/user.schema';
export declare class AnalyticsService {
    private readonly boosterPullRecordRepository;
    constructor(boosterPullRecordRepository: EntityRepository<BoosterPullRecord>);
    logBoosterPullRecord(user: User, boosterPack: BoosterPack, cardIds: string[]): void;
}

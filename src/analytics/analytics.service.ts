import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BoosterPullRecord } from './booster-pull-record.schema';
import { EntityRepository } from '@mikro-orm/mongodb';
import { BoosterPack } from '../card/card.interface';
import { User } from '../user/user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(BoosterPullRecord)
    private readonly boosterPullRecordRepository: EntityRepository<BoosterPullRecord>,
  ) {}

  /**
   * Log a booster pull record in the database for analytics tracking.
   *
   * @param user the user pulling hte booster pack
   * @param boosterPack the pack being pulled
   * @param cardIds the ids of the cards in the booster pack
   */
  logBoosterPullRecord(
    user: User,
    boosterPack: BoosterPack,
    cardIds: string[],
  ) {
    const record = new BoosterPullRecord(user._id, boosterPack, cardIds);

    this.boosterPullRecordRepository.persist(record);
  }
}

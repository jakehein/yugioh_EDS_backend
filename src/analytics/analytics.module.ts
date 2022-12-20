import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BoosterPullRecord } from './booster-pull-record.schema';

@Module({
  imports: [MikroOrmModule.forFeature([BoosterPullRecord])],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

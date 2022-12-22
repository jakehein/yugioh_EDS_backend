import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { BoosterPackModule } from './booster-pack/booster-pack.module';
import { AuthModule } from './auth/auth.module';
import { SideDeckModule } from './side-deck/side-deck.module';
import { ConfigModule } from './config/config.module';
import { ExceptionCatchFilter } from './_util/filters/error-filter.filter';
import { MaintenanceGuard } from './maintenance/maintenance.guard';
import { FlushInterceptor } from './_util/interceptors/flush.interceptors';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ContentModule } from './content/content.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { UuidModule } from './uuid/uuid.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    BoosterPackModule,
    CardModule,
    DeckModule,
    SideDeckModule,
    UserModule,
    ContentModule,
    AnalyticsModule,
    AccountModule,
    UuidModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: ExceptionCatchFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: MaintenanceGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: FlushInterceptor,
    },
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

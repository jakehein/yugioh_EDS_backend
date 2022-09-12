import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { BoosterPackModule } from './booster-pack/booster-pack.module';
import { AuthModule } from './auth/auth.module';
import { SideDeckModule } from './side-deck/side-deck.module';
import { ConfigModule } from './config/config.module';
import { EntityManager } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    BoosterPackModule,
    CardModule,
    DeckModule,
    SideDeckModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

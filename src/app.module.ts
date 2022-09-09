import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { BoosterPackModule } from './booster-pack/booster-pack.module';
import { AuthModule } from './auth/auth.module';
import { SideDeckModule } from './side-deck/side-deck.module';

@Module({
  imports: [
    UserModule,
    DeckModule,
    CardModule,
    BoosterPackModule,
    AuthModule,
    SideDeckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

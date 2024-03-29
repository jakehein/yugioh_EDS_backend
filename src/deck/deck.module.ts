import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { UserModule } from '../user/user.module';
import { CardModule } from '../card/card.module';
import { UuidModule } from '../uuid/uuid.module';

@Module({
  imports: [UserModule, CardModule, UuidModule],
  controllers: [DeckController],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}

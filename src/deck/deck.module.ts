import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { UserModule } from '../user/user.module';
import { ContentModule } from '../content/content.module';
import { CardModule } from '../card/card.module';

@Module({
  imports: [UserModule, ContentModule, CardModule],
  controllers: [DeckController],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}

import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}

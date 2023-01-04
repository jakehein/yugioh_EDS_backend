import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { UserModule } from '../user/user.module';
import { UuidModule } from '../uuid/uuid.module';

@Module({
  imports: [UserModule, UuidModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}

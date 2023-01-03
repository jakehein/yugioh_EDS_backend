import { Module } from '@nestjs/common';
import { ContentModule } from '../../content/content.module';
import { UserModule } from '../../user/user.module';
import { UuidModule } from '../../uuid/uuid.module';
import { UserCardsController } from './user-cards.controller';
import { UserCardsService } from './user-cards.service';

@Module({
  imports: [UserModule, ContentModule, UuidModule],
  controllers: [UserCardsController],
  providers: [UserCardsService],
  exports: [UserCardsService],
})
export class UserCardsModule {}

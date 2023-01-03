import { Module } from '@nestjs/common';
import { UserCardsModule } from './user-cards/user-cards.module';

@Module({
  imports: [UserCardsModule],
  exports: [UserCardsModule],
})
export class UserContentModule {}

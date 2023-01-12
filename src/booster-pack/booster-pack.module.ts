import { Module } from '@nestjs/common';
import { BoosterPackController } from './booster-pack.controller';
import { BoosterPackService } from './booster-pack.service';
import { UserModule } from '../user/user.module';
import { ContentModule } from '../content/content.module';
import { UuidModule } from '../uuid/uuid.module';

@Module({
  imports: [UserModule, UuidModule, ContentModule],
  controllers: [BoosterPackController],
  providers: [BoosterPackService],
})
export class BoosterPackModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';
import { ContentModule } from '../content/content.module';
import { UsersValidationService } from './user-validation.service';
import { UuidModule } from '../uuid/uuid.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), ContentModule, UuidModule],
  providers: [UserService, UsersValidationService],
  exports: [UserService],
})
export class UserModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';
import { ContentModule } from '../content/content.module';
import { UsersValidationService } from './user-validation.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), ContentModule],
  providers: [UserService, UsersValidationService],
  exports: [UserService],
})
export class UserModule {}

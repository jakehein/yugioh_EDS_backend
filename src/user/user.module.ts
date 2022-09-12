import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './user.schema';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [],
  exports: [],
})
export class UserModule {}

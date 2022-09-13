import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserModule, PassportModule],
  providers: [],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}

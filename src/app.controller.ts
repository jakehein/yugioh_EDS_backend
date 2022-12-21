import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from './account/account.service';
import { AppService } from './app.service';
import { BearerAuthGuard } from './auth/bearer-auth.guard';
import { RequestUser } from './request-user.decorator';
import { User } from './user/user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountService: AccountService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(BearerAuthGuard)
  getUser(@RequestUser() user: User) {
    return { account: this.accountService.getMainAccountInformationFor(user) };
  }
}

import { AccountService } from './account/account.service';
import { AppService } from './app.service';
import { User } from './user/user.schema';
export declare class AppController {
    private readonly appService;
    private readonly accountService;
    constructor(appService: AppService, accountService: AccountService);
    getUser(user: User): {
        account: import("./account/account.interfaces").AccountUser;
    };
}

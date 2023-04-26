import { User } from '../user/user.schema';
import { AccountUser } from './account.interfaces';
export declare class AccountService {
    getMainAccountInformationFor(user: User): AccountUser;
}

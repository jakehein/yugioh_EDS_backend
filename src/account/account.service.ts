import { Injectable } from '@nestjs/common';
import { User } from '../user/user.schema';
import { AccountUser } from './account.interfaces';

@Injectable()
export class AccountService {
  /**
   * Get only the main user account information for /me.
   * Strips out unnecessary information such as weapons, characters, etc. to keep the response small.
   *
   * @param user the user to get the account information for
   * @returns the limited user information
   */
  getMainAccountInformationFor(user: User): AccountUser {
    const userData: AccountUser = {
      _id: user._id,
      firebaseUId: user.firebaseUId,
      accountId: user.accountId,
      name: user.name,
    };

    return userData;
  }
}

import { ObjectId } from 'mongodb';
import { UserBoosterPack } from '../user/user.schema';
export interface AccountUser {
    _id: ObjectId;
    firebaseUId: string;
    accountId: string;
    name: string;
    boostersAvailable: UserBoosterPack[];
    boostersCompleted: UserBoosterPack[];
}

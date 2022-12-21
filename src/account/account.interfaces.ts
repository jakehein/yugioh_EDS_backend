import { ObjectId } from 'mongodb';

export interface AccountUser {
  _id: ObjectId;
  firebaseUId: string;
  accountId: string;
  name: string;
}

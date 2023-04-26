import { Auth } from 'firebase-admin/auth';
import { Branded } from 'io-ts';
import { EmailBrand } from '../io-ts-extra-codecs';
export declare class UserEmailRetrieverService {
    private readonly firebaseAuth;
    constructor(firebaseAuth: Auth);
    getUserEmailFromFirebaseUId(firebaseUId: string): Promise<Branded<string, EmailBrand> | null>;
}

import { Inject, Injectable } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { match } from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { Branded } from 'io-ts';
import { email, EmailBrand } from '../io-ts-extra-codecs';

@Injectable()
export class UserEmailRetrieverService {
  constructor(
    @Inject('FIREBASE_ADMIN_AUTH') private readonly firebaseAuth: Auth,
  ) {}

  async getUserEmailFromFirebaseUId(
    firebaseUId: string,
  ): Promise<Branded<string, EmailBrand> | null> {
    const firebaseUser = await this.firebaseAuth.getUser(firebaseUId);

    if (!firebaseUser.email) return null;

    return pipe(
      email.decode(firebaseUser.email),
      match(() => {
        throw new Error(
          'Email address returned from Firebase is somehow not a valid email address',
        );
      }, identity),
    );
  }
}

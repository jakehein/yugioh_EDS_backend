import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
} from 'firebase/auth';
import { CreateUserDto } from '../_util/dtos/createUser.dto';

// move to own model file? Interface file?
export interface UserResult {
  decodedToken: DecodedIdToken;
  user: User;
  id: string;
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === 'object' &&
    !!error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    @Inject('FIREBASE_ADMIN_AUTH')
    private readonly firebaseAuth: Auth,
    private firebaseService: FirebaseService,
  ) {}

  async login(email: string, password: string): Promise<void> {
    // firebase logic here
    //signInWithCustomToken
    // const userCredentials = await signInWithEmailAndPassword(
    //   this.firebaseService.auth,
    //   email,
    //   password,
    // );
  }

  async register(body: CreateUserDto): Promise<string> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.firebaseService.auth,
          body.email,
          body.password,
        );

      let jwt: string;

      if (userCredential) {
        const id: string = userCredential.user.uid;

        console.log('test');
        jwt = await this.firebaseAuth.createCustomToken(id);
      }

      if (!jwt) {
        throw new Error('jwt is empty');
      }
      return jwt;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Validate a user by their token (idToken).
   *
   * @param token the idToken to validate
   * @returns a UserResult if the token is valid, otherwise an error
   */
  async validateUserByToken(token: string): Promise<UserResult> {
    let decodedToken;
    try {
      decodedToken = await this.firebaseAuth.verifyIdToken(token);
    } catch (err) {
      if (
        isFirebaseError(err) &&
        (err.code === 'auth/argument-error' ||
          err.code === 'auth/id-token-expired')
      ) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }

    let user = await this.usersService.findByFirebaseUId(decodedToken.uid);

    if (!user) {
      user = await this.usersService.createFromFirebase(
        decodedToken.uid,
        decodedToken.auth_time,
      );
    }

    if (!user.authTime || user.authTime <= decodedToken.auth_time) {
      user.authTime = decodedToken.auth_time;
    } else {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Current user session has timed out.',
      });
    }

    return { decodedToken, user, id: user._id.toHexString() };
  }
}

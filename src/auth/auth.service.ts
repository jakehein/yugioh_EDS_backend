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
  Auth as basicAuth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
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

  async getUserCredentials(
    userCredentialsFunc: (
      auth: basicAuth,
      email: string,
      password: string,
    ) => Promise<UserCredential>,
    body: CreateUserDto,
  ): Promise<string> {
    try {
      const userCredential: UserCredential = await userCredentialsFunc(
        this.firebaseService.auth,
        body.email,
        body.password,
      );
      let jwt: string;

      if (userCredential) {
        const id: string = userCredential.user.uid;
        jwt = await this.firebaseAuth.createCustomToken(id);
      }

      return jwt;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async login(body: CreateUserDto): Promise<{ jwt: string }> {
    return {
      jwt: await this.getUserCredentials(signInWithEmailAndPassword, body),
    };
  }

  async register(body: CreateUserDto): Promise<{ jwt: string }> {
    return {
      jwt: await this.getUserCredentials(createUserWithEmailAndPassword, body),
    };
  }

  /**
   * Validate a user by their token (customToken).
   *
   * @param token the customToken to validate
   * @returns a UserResult if the token is valid, otherwise an error
   */
  async validateUserByToken(token: string): Promise<UserResult> {
    let decodedToken: DecodedIdToken;
    let validatedIdToken: string;
    let userCredential: UserCredential;
    try {
      console.log(token);

      userCredential = await signInWithCustomToken(
        this.firebaseService.auth,
        token,
      );
      validatedIdToken = await userCredential.user.getIdToken(true);
      decodedToken = await this.firebaseAuth.verifyIdToken(validatedIdToken);
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

import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase/firebase.service';
import { Auth as basicAuth, UserCredential } from 'firebase/auth';
import { CreateUserDto } from '../_util/dtos/createUser.dto';
export interface UserResult {
    decodedToken: DecodedIdToken;
    user: User;
    id: string;
}
export declare class AuthService {
    private usersService;
    private readonly firebaseAuth;
    private firebaseService;
    constructor(usersService: UserService, firebaseAuth: Auth, firebaseService: FirebaseService);
    getUserCredentials(userCredentialsFunc: (auth: basicAuth, email: string, password: string) => Promise<UserCredential>, body: CreateUserDto): Promise<string>;
    login(body: CreateUserDto): Promise<{
        jwt: string;
    }>;
    register(body: CreateUserDto): Promise<{
        jwt: string;
    }>;
    validateUserByToken(token: string): Promise<UserResult>;
}

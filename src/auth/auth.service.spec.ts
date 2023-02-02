import { Test, TestingModule } from '@nestjs/testing';
import { Auth } from 'firebase/auth';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: {
    findByFirebaseUId: jest.MockedFunction<UserService['findByFirebaseUId']>;
    createFromFirebase: jest.MockedFunction<UserService['createFromFirebase']>;
  };
  let firebaseAdminAuthMock: {
    verifyIdToken: jest.MockedFunction<
      (token: string) => Promise<{ uid: string; auth_time: number }>
    >;
    createCustomToken: jest.MockedFunction<(uid: string) => Promise<string>>;
  };
  let firebaseServiceMock: {
    auth: jest.MockedFunction<() => Auth>;
  };

  beforeEach(async () => {
    usersServiceMock = {
      findByFirebaseUId: jest.fn(),
      createFromFirebase: jest.fn(),
    };
    firebaseAdminAuthMock = {
      verifyIdToken: jest.fn(),
      createCustomToken: jest.fn(),
    };
    firebaseServiceMock = {
      auth: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: usersServiceMock,
        },
        {
          provide: 'FIREBASE_ADMIN_AUTH',
          useValue: firebaseAdminAuthMock,
        },
        {
          provide: FirebaseService,
          useValue: firebaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

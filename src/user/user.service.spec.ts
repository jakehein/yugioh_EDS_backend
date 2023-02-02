import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { UuidService } from '../uuid/uuid.service';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { UsersValidationService } from './user-validation.service';
import { User } from './user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repoMock: RepoMock<User>;
  let usersValidationServiceMock: {
    validateUserFields: jest.MockedFunction<(user: User) => void>;
  };
  let uuidServiceMock: {
    getUuid: jest.MockedFunction<() => string>;
  };

  beforeEach(async () => {
    repoMock = new MikroOrmRepositoryMock<User>();

    usersValidationServiceMock = {
      validateUserFields: jest.fn(),
    };

    uuidServiceMock = {
      getUuid: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: UsersValidationService,
          useValue: usersValidationServiceMock,
        },
        {
          provide: UuidService,
          useValue: uuidServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

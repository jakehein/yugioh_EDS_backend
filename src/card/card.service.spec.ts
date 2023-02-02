import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { User } from '../user/user.schema';
import { ContentAccessorService } from '../content/content-accessor.service';
import { UuidService } from '../uuid/uuid.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';

describe('CardService', () => {
  let service: CardService;
  let repoMock: RepoMock<User>;
  let uuidServiceMock: {
    getUuid: jest.MockedFunction<() => string>;
  };
  let contentAccessorServiceMock: {
    getContentEntryByIdAndContentTypeOptional: jest.MockedFunction<
      ContentAccessorService['getContentEntryByIdAndContentTypeOptional']
    >;
    getAllContentCardsByPasscode: jest.MockedFunction<
      ContentAccessorService['getAllContentCardsByPasscode']
    >;
  };

  beforeEach(async () => {
    repoMock = new MikroOrmRepositoryMock<User>();

    contentAccessorServiceMock = {
      getContentEntryByIdAndContentTypeOptional: jest.fn(),
      getAllContentCardsByPasscode: jest.fn(),
    };

    uuidServiceMock = {
      getUuid: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: UuidService,
          useValue: uuidServiceMock,
        },
        {
          provide: ContentAccessorService,
          useValue: contentAccessorServiceMock,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from '../card/card.service';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserCard } from '../user/user.schema';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { BoosterPackService } from './booster-pack.service';

describe('BoosterPackService', () => {
  let service: BoosterPackService;
  let repoMock: RepoMock<User>;
  let contentAccessorServiceMock: {
    getContentEntryByIdAndContentTypeOptional: jest.MockedFunction<
      ContentAccessorService['getContentEntryByIdAndContentTypeOptional']
    >;
    getAllContentCardsByPasscode: jest.MockedFunction<
      ContentAccessorService['getAllContentCardsByPasscode']
    >;
  };
  let cardServiceMock: {
    addToTrunk: jest.MockedFunction<(user: User, cardId: string) => UserCard>;
  };

  beforeEach(async () => {
    repoMock = new MikroOrmRepositoryMock<User>();

    contentAccessorServiceMock = {
      getContentEntryByIdAndContentTypeOptional: jest.fn(),
      getAllContentCardsByPasscode: jest.fn(),
    };

    cardServiceMock = {
      addToTrunk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoosterPackService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: CardService,
          useValue: cardServiceMock,
        },
        {
          provide: ContentAccessorService,
          useValue: contentAccessorServiceMock,
        },
      ],
    }).compile();

    service = module.get<BoosterPackService>(BoosterPackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

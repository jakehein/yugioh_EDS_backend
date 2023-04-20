import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { BoosterPack } from '../card/card.interface';
import { CardService } from '../card/card.service';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
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

  let uuidServiceMock: {
    getUuid: jest.MockedFunction<() => string>;
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
        {
          provide: UuidService,
          useValue: uuidServiceMock,
        },
      ],
    }).compile();

    service = module.get<BoosterPackService>(BoosterPackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableBoosters', () => {
    it('gets boosters available to the user', () => {
      let uuidStandin = 0;
      const boosters: { uuid: string; contentId: BoosterPack }[] = [];
      Object.values(BoosterPack).forEach((boosterPack) => {
        boosters.push({
          uuid: (uuidStandin++).toString(),
          contentId: boosterPack,
        });
      });
      const user = new User('0', '0', '0', 0, boosters, '0', '0');

      const getAvailableBoosters = service.getAvailableBoosters(user);

      expect(getAvailableBoosters).toMatchObject(boosters);
    });
  });

  describe('getCompletedBoosters', () => {
    it('gets boosters completed by the user', () => {
      expect({}).toMatchObject({});
    });
  });

  describe('getBoosterPackContent', () => {
    it('gets the booster pack content data', () => {
      expect({}).toMatchObject({});
    });
  });

  describe('getCardsOfBoosterPack', () => {
    it('gets the cards of a specific booster pack', () => {
      expect({}).toMatchObject({});
    });
  });

  describe('drawFromBoosterPack', () => {
    it('draws the 5 selected cards from a specific booster pack for a user', () => {
      expect({}).toMatchObject({});
    });
  });
});

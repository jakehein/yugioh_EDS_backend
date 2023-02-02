import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { User } from '../user/user.schema';
import { ContentAccessorService } from '../content/content-accessor.service';
import { UuidService } from '../uuid/uuid.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { when } from 'jest-when';
import {
  Attribute,
  BoosterPack,
  CardType,
  ICard,
  MonsterType,
  Property,
  Rarity,
  Status,
} from './card.interface';

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

  describe('getCardContent', () => {
    it('gets the contents of the card given a contentId', () => {
      const contentId = 'Dark Magician-Dark Magician';
      const card: ICard = {
        id: contentId,
        name: 'Dark Magician',
        description: "it's ya boi",
        boosterPack: BoosterPack.DarkMagician,
        cardType: CardType.Monster,
        rarity: Rarity.Rare,
        imgLink: 'https://someImgLinkHere',
        isFusionMonster: false,
        isRitualMonster: false,
        status: Status.Unlimited,
        passcode: '123456789',
        monsterTypes: [MonsterType.Spellcaster],
        atk: '2500',
        def: '2100',
        attribute: Attribute.Dark,
        level: 7,
      };
      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('cards', contentId)
        .mockReturnValue(card);

      const getCardContentTest = service.getCardContent(contentId);

      expect(getCardContentTest).toMatchObject(card);
    });
  });
});

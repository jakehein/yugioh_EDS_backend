import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { ICard } from '../card/card.interface';
import { CardService } from '../card/card.service';
import { User } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { DeckService } from './deck.service';

describe('DeckService', () => {
  let service: DeckService;
  let repoMock: RepoMock<User>;
  let uuidServiceMock: {
    getUuid: jest.MockedFunction<() => string>;
  };
  let cardServiceMock: {
    getCardContent: jest.MockedFunction<(cardId: string) => ICard>;
  };

  beforeEach(async () => {
    repoMock = new MikroOrmRepositoryMock<User>();

    cardServiceMock = {
      getCardContent: jest.fn(),
    };

    uuidServiceMock = {
      getUuid: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: UuidService,
          useValue: uuidServiceMock,
        },
        {
          provide: CardService,
          useValue: cardServiceMock,
        },
      ],
    }).compile();

    service = module.get<DeckService>(DeckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

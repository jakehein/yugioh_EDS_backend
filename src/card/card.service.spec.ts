import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { ContentAccessorService } from '../content/content-accessor.service';
import { UuidService } from '../uuid/uuid.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { when } from 'jest-when';
import {
  Attribute,
  BoosterPack,
  CardType,
  ICard,
  ICardCopies,
  MonsterType,
  Rarity,
  Status,
} from './card.interface';
import {
  BoosterPackDoesNotContainCardException,
  CardNotFoundException,
} from '../content-errors';

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
    it('gets the contents of the card given a contentId', () => {
      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('cards', contentId)
        .mockReturnValue(card);

      const getCardContentTest = service.getCardContent(contentId);

      expect(getCardContentTest).toMatchObject(card);
    });

    it('throws a CardNotFoundException', () => {
      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('cards', contentId)
        .mockReturnValue(undefined);
      expect(() => service.getCardContent(contentId)).toThrow(
        CardNotFoundException,
      );
    });
  });

  describe('getTrunk', () => {
    it('gets the trunk of a given user', () => {
      const trunk = [
        new UserCard('0', 'Beast Fangs-Dark Magician', 1),
        new UserCard('1', 'Book of Secret Arts-Dark Magician', 1),
        new UserCard('2', 'Dark Hole-Dark Magician', 1),
        new UserCard('3', 'Dark Magician-Dark Magician', 1),
        new UserCard('4', 'Fissure-Dark Magician', 1),
      ];
      const boosters = [{ uuid: '1', contentId: BoosterPack.DarkMagician }];
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
        {
          trunk: trunk,
        },
      );
      expect(user.trunk).toMatchObject(trunk);
    });
  });

  describe('getTrunkContents', () => {
    it('gets the trunk content for a given user', () => {
      const cardContents = [
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            'A Beast-type monster equipped with this card increases its ATK and DEF by 300 points.',
          id: 'Beast Fangs-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/0/0d/BeastFangs-EDS-EN-VG.png/revision/latest?cb=20100920001333',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Beast Fangs',
          passcode: '46009906',
          property: 'Equip',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            'A Spellcaster-Type monster equipped with this card increases its ATK and DEF by 300 points.',
          id: 'Book of Secret Arts-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/5/5b/BookofSecretArts-EDS-EN-VG.png/revision/latest?cb=20140508064823',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Book of Secret Arts',
          passcode: '91595718',
          property: 'Equip',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description: 'Destroy all monsters on the field.',
          id: 'Dark Hole-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/8/81/DarkHole-EDS-EN-VG.png/revision/latest?cb=20140511063348',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Dark Hole',
          passcode: '53129443',
          property: 'Normal',
          rarity: 'Rare',
          status: 'Limited',
        },
        {
          atk: '2500',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '2100',
          description: 'The ultimate wizard in terms of attack and defense.',
          id: 'Dark Magician-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/b/b3/DarkMagician-EDS-EN-VG.png/revision/latest?cb=20100905201358',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 7,
          monsterTypes: ['Spellcaster', 'Normal'],
          name: 'Dark Magician',
          passcode: '46986414',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            "Destroy 1 opponent's face-up monster with the lowest ATK.",
          id: 'Fissure-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/7/7b/Fissure-EDS-EN-VG.png/revision/latest?cb=20100813220746',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Fissure',
          passcode: '66788016',
          property: 'Normal',
          rarity: 'Rare',
          status: 'Unlimited',
        },
      ];
      const trunk = [
        new UserCard('0', 'Beast Fangs-Dark Magician', 1),
        new UserCard('1', 'Book of Secret Arts-Dark Magician', 1),
        new UserCard('2', 'Dark Hole-Dark Magician', 1),
        new UserCard('3', 'Dark Magician-Dark Magician', 1),
        new UserCard('4', 'Fissure-Dark Magician', 1),
      ];
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: trunk,
        },
      );

      trunk.forEach((userCard, index) => {
        when(
          contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional,
        )
          .calledWith('cards', userCard.contentId)
          .mockReturnValue(cardContents[index] as ICard);
      });

      const getTrunkContents = service.getTrunkContents(user);

      expect(getTrunkContents).toMatchObject(cardContents);
    });
  });

  describe('getCardFromTrunk', () => {
    const trunk = [
      new UserCard('0', 'Beast Fangs-Dark Magician', 1),
      new UserCard('1', 'Book of Secret Arts-Dark Magician', 1),
      new UserCard('2', 'Dark Hole-Dark Magician', 1),
      new UserCard('3', 'Dark Magician-Dark Magician', 1),
      new UserCard('4', 'Fissure-Dark Magician', 1),
    ];
    let index = 0;
    it.each([
      'Beast Fangs-Dark Magician',
      'Book of Secret Arts-Dark Magician',
      'Dark Hole-Dark Magician',
      'Dark Magician-Dark Magician',
      'Fissure-Dark Magician',
    ])('gets a card with contentId of %s from user trunk', (contentId) => {
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: trunk,
        },
      );
      const getCardFromTrunk = service.getCardFromTrunk(user, contentId);
      const expected = trunk[index++];
      expect(getCardFromTrunk).toMatchObject(expected);
    });
  });

  describe('addToTrunk', () => {
    const trunk = [
      new UserCard('0', 'Beast Fangs-Dark Magician', 1),
      new UserCard('1', 'Book of Secret Arts-Dark Magician', 1),
      new UserCard('2', 'Dark Hole-Dark Magician', 1),
      new UserCard('3', 'Dark Magician-Dark Magician', 1),
      new UserCard('4', 'Fissure-Dark Magician', 1),
    ];
    it('increments the number of copies a user has of a card', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: trunk,
        },
      );
      const addToTrunk = service.addToTrunk(user, 'Beast Fangs-Dark Magician');
      expect(addToTrunk.copies).toStrictEqual(2);
    });

    it('adds a new card to a user', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: trunk,
        },
      );
      const cardContentToAdd = {
        atk: '2300',
        attribute: 'EARTH',
        boosterPack: 'Dark Magician',
        cardType: 'Monster',
        def: '2100',
        description:
          'A knight whose horse travels faster than the wind. His battle-charge is a force to be reckoned with.',
        id: 'Gaia The Fierce Knight-Dark Magician',
        imgLink:
          'https://static.wikia.nocookie.net/yugioh/images/6/64/GaiaTheFierceKnight-EDS-EN-VG.png/revision/latest?cb=20100813221036',
        isFusionMonster: false,
        isRitualMonster: false,
        level: 7,
        monsterTypes: ['Warrior', 'Normal'],
        name: 'Gaia The Fierce Knight',
        passcode: '06368038',
        rarity: 'Rare',
        status: 'Unlimited',
      } as ICard;

      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('cards', 'Gaia The Fierce Knight-Dark Magician')
        .mockReturnValue(cardContentToAdd);

      when(uuidServiceMock.getUuid).mockReturnValue('uuidServiceMockValue');

      const addToTrunk = service.addToTrunk(
        user,
        'Gaia The Fierce Knight-Dark Magician',
      );
      expect(addToTrunk).toStrictEqual(trunk[5]);
    });

    it('throws a CardNotFoundException', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: trunk,
        },
      );
      expect(() => service.addToTrunk(user, 'not a real value')).toThrow(
        CardNotFoundException,
      );
    });
  });

  describe('addToTrunkByPasscode', () => {
    it('adds to the trunk given a passcode value', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
      );
      const cardContentsToAdd = [
        {
          atk: '2300',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '2100',
          description:
            'A knight whose horse travels faster than the wind. His battle-charge is a force to be reckoned with.',
          id: 'Gaia The Fierce Knight-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/64/GaiaTheFierceKnight-EDS-EN-VG.png/revision/latest?cb=20100813221036',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 7,
          monsterTypes: ['Warrior', 'Normal'],
          name: 'Gaia The Fierce Knight',
          passcode: '06368038',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          atk: '2300',
          attribute: 'EARTH',
          boosterPack: 'Blue-Eyes White Dragon',
          cardType: 'Monster',
          def: '2100',
          description:
            'A knight whose horse travels faster than the wind. His battle-charge is a force to be reckoned with.',
          id: 'Gaia The Fierce Knight-Blue-Eyes White Dragon',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/64/GaiaTheFierceKnight-EDS-EN-VG.png/revision/latest?cb=20100813221036',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 7,
          monsterTypes: ['Warrior', 'Normal'],
          name: 'Gaia The Fierce Knight',
          passcode: '06368038',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          atk: '2300',
          attribute: 'EARTH',
          boosterPack: 'Final',
          cardType: 'Monster',
          def: '2100',
          description:
            'A knight whose horse travels faster than the wind. His battle-charge is a force to be reckoned with.',
          id: 'Gaia The Fierce Knight-Final',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/2/2c/GaiaTheFierceKnight-EDS-EN-VG-2.png/revision/latest?cb=20140515220642',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 7,
          monsterTypes: ['Warrior', 'Normal'],
          name: 'Gaia The Fierce Knight',
          passcode: '06368038',
          rarity: 'Common',
          status: 'Unlimited',
        },
      ] as ICard[];
      const passcode = '06368038';
      when(contentAccessorServiceMock.getAllContentCardsByPasscode)
        .calledWith(passcode)
        .mockReturnValue(cardContentsToAdd);

      cardContentsToAdd.forEach((cardContent) => {
        when(
          contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional,
        )
          .calledWith('cards', cardContent.id)
          .mockReturnValue(cardContent);
      });

      const addToTrunkByPasscode = service.addToTrunkByPasscode(user, passcode);
      expect(addToTrunkByPasscode).toMatchObject([
        {
          contentId: 'Gaia The Fierce Knight-Dark Magician',
          copies: 1,
        },
        {
          contentId: 'Gaia The Fierce Knight-Blue-Eyes White Dragon',
          copies: 1,
        },
        { contentId: 'Gaia The Fierce Knight-Final', copies: 1 },
      ] as UserCard[]);
    });
  });

  describe('checkBoostersCompletedForUser', () => {
    it('adds a booster to the completed list', () => {
      const testBooster = [
        new UserBoosterPack('1', BoosterPack.DarkMagician, [
          new UserCard('1', 'test', 1),
        ]),
      ];
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          boostersAvailable: testBooster,
          boostersCompleted: [],
        },
      );

      const checkBoostersCompletedForUser =
        service.checkBoostersCompletedForUser(user);

      expect(checkBoostersCompletedForUser.length).toStrictEqual(1);
      expect(checkBoostersCompletedForUser).toMatchObject(testBooster);
    });
    it('confirms that no boosters are completed', () => {
      const testBooster = [
        new UserBoosterPack('1', BoosterPack.DarkMagician, [
          new UserCard('1', 'test', 0),
        ]),
      ];
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          boostersAvailable: testBooster,
          boostersCompleted: [],
        },
      );

      const checkBoostersCompletedForUser =
        service.checkBoostersCompletedForUser(user);

      expect(checkBoostersCompletedForUser.length).toStrictEqual(0);
      expect(checkBoostersCompletedForUser).toMatchObject([]);
    });
  });

  describe('getGeneralCardDataBasedOnPasscode', () => {
    it('gets the ICardCopies array output of a card based on passcode', () => {
      const trunkCard = {
        id: '1',
        passcode: '12345678',
        name: 'test',
      } as ICard;
      const userCard = new UserCard('0', trunkCard.id, 1);
      const user = Object.assign(
        new User('0', '0', '0', 0, [] as any[], '0', '0'),
        {
          trunk: [userCard],
        },
      );

      user.trunk.forEach((card) => {
        when(
          contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional,
        )
          .calledWith('cards', card.contentId)
          .mockReturnValue({
            ...trunkCard,
            copies: userCard.copies,
          } as ICardCopies);
      });

      const getGeneralCardDataBasedOnPasscode =
        service.getGeneralCardDataBasedOnPasscode(user, trunkCard.name);

      expect(getGeneralCardDataBasedOnPasscode).toMatchObject([
        {
          ...trunkCard,
          copies: 1,
        },
      ] as ICardCopies[]);
    });
  });
});

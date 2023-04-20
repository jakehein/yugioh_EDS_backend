import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { BoosterPack, ICard } from '../card/card.interface';
import { CardService } from '../card/card.service';
import {
  BoosterPackDoesNotContainCardException,
  BoosterPackIsAlreadyUnlockedException,
  BoosterPackNotFoundException,
  CardNotFoundException,
} from '../content-errors';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
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
          //doublecheck if i actually care about this...
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
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      const getAvailableBoosters = service.getAvailableBoosters(user);

      const getAbrevBoosters = getAvailableBoosters.map((booster) => {
        return {
          uuid: booster.id,
          contentId: booster.contentId,
        };
      });

      expect(boosters.length).toStrictEqual(getAvailableBoosters.length);
      expect(getAvailableBoosters).toMatchObject(user.boostersAvailable);
      expect(getAbrevBoosters).toMatchObject(boosters);
    });
  });

  describe('getUnlockedAvailableBoosters', () => {
    it('gets boosters marked unlocked by the user', () => {
      let uuidStandin = 0;
      const boosters: { uuid: string; contentId: BoosterPack }[] = [];
      Object.values(BoosterPack).forEach((boosterPack) => {
        boosters.push({
          uuid: (uuidStandin++).toString(),
          contentId: boosterPack,
        });
      });
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      const expectedUnlockedOnInit = [
        { contentId: BoosterPack.DarkMagician },
        { contentId: BoosterPack.MysticalElf },
        { contentId: BoosterPack.RedEyesBDragon },
        { contentId: BoosterPack.weeklyYuGiOh1 },
        { contentId: BoosterPack.weeklyYuGiOh2 },
        { contentId: BoosterPack.Magazine },
        { contentId: BoosterPack.GrandpaCupQualifying },
        { contentId: BoosterPack.GrandpaCupFinal },
      ];

      const getUnlockedAvailableBoosters =
        service.getUnlockedAvailableBoosters(user);

      expect(getUnlockedAvailableBoosters.length).toStrictEqual(8);
      expect(getUnlockedAvailableBoosters).toMatchObject(
        expectedUnlockedOnInit,
      );
    });
  });

  describe('unlockAvailableBooster', () => {
    let uuidStandin = 0;
    const boosters: { uuid: string; contentId: BoosterPack }[] = [];
    Object.values(BoosterPack).forEach((boosterPack) => {
      boosters.push({
        uuid: (uuidStandin++).toString(),
        contentId: boosterPack,
      });
    });

    it('sets the isUnlocked property of a booster to true for the user', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      const boosterPackToUnlock = BoosterPack.GateGuardian;

      const unlockAvailableBooster = service.unlockAvailableBooster(
        user,
        boosterPackToUnlock,
      );

      expect(unlockAvailableBooster).toMatchObject({
        contentId: boosterPackToUnlock,
        isUnlocked: true,
      });
    });
    it('throws a BoosterPackNotFoundException', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );
      const fakeBoosterId = 'fake booster id';

      expect(() =>
        service.unlockAvailableBooster(user, fakeBoosterId as BoosterPack),
      ).toThrow(BoosterPackNotFoundException);
    });
    it('throws a BoosterPackIsAlreadyUnlockedException', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );
      const knownUnlockedBooster = BoosterPack.DarkMagician;

      expect(() =>
        service.unlockAvailableBooster(user, knownUnlockedBooster),
      ).toThrow(BoosterPackIsAlreadyUnlockedException);
    });
  });

  describe('getCompletedBoosters', () => {
    let uuidStandin = 0;
    const boosters: { uuid: string; contentId: BoosterPack }[] = [];
    Object.values(BoosterPack).forEach((boosterPack) => {
      boosters.push({
        uuid: (uuidStandin++).toString(),
        contentId: boosterPack,
      });
    });
    it('gets boosters completed by the user on init', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      const getCompletedBoosters = service.getCompletedBoosters(user);
      expect(getCompletedBoosters.length).toStrictEqual(0);
    });

    it('gets boosters completed by the user given a pack is completed', () => {
      const expectedCompletedBoosterPack = new UserBoosterPack(
        '0',
        BoosterPack.DarkMagician,
      );
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
        {
          boostersCompleted: expectedCompletedBoosterPack,
        },
      );

      const getCompletedBoosters = service.getCompletedBoosters(user);
      expect(getCompletedBoosters).toMatchObject(expectedCompletedBoosterPack);
    });
  });

  describe('getBoosterPackContent', () => {
    it('gets the booster pack content data', () => {
      const darkMagicianContentData = {
        cardIds: [
          'Beast Fangs-Dark Magician',
          'Book of Secret Arts-Dark Magician',
          'Dark Hole-Dark Magician',
          'Dark Magician-Dark Magician',
          'Fissure-Dark Magician',
          'Gaia The Fierce Knight-Dark Magician',
          'Legendary Sword-Dark Magician',
          'Power of Kaishin-Dark Magician',
          'Trap Hole-Dark Magician',
          'Violet Crystal-Dark Magician',
          'Air Marmot of Nefariousness-Dark Magician',
          'Candle of Fate-Dark Magician',
          'Curtain of the Dark Ones-Dark Magician',
          'Dark Gray-Dark Magician',
          'Eyearmor-Dark Magician',
          "Fiend's Hand-Dark Magician",
          'Fire Reaper-Dark Magician',
          'Firegrass-Dark Magician',
          'Haniwa-Dark Magician',
          'Hitodenchak-Dark Magician',
          'Hitotsu-Me Giant-Dark Magician',
          'Hourglass of Life-Dark Magician',
          'Kagemusha of the Blue Flame-Dark Magician',
          'Kaminarikozou-Dark Magician',
          'Kurama-Dark Magician',
          'LaLa Li-oon-Dark Magician',
          'Mammoth Graveyard-Dark Magician',
          'Meotoko-Dark Magician',
          'Nemuriko-Dark Magician',
          'Petit Angel-Dark Magician',
          'Petit Dragon-Dark Magician',
          'Red Medicine-Dark Magician',
          'Sectarian of Secrets-Dark Magician',
          'Silver Fang-Dark Magician',
          'Sparks-Dark Magician',
          'The Drdek-Dark Magician',
          'The Furious Sea King-Dark Magician',
          'Tomozaurus-Dark Magician',
          'Wicked Mirror-Dark Magician',
          'Winged Cleaver-Dark Magician',
        ],
        id: 'Dark Magician',
        imgLink:
          'https://static.wikia.nocookie.net/yugioh/images/c/ce/DarkMagician-Booster-EDS.png/revision/latest?cb=20170126032525',
        name: 'Dark Magician',
        unlockCondition: 'Unlocked at the beginning of the game.',
      };

      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('boosterPacks', darkMagicianContentData.id)
        .mockReturnValue(darkMagicianContentData);

      const getBoosterPackContent = service.getBoosterPackContent(
        darkMagicianContentData.id as BoosterPack,
      );

      expect(getBoosterPackContent).toMatchObject(darkMagicianContentData);
    });

    it('throws a BoosterPackNotFoundException', () => {
      const fakeBoosterId = 'fake booster id';

      expect(() =>
        service.getBoosterPackContent(fakeBoosterId as BoosterPack),
      ).toThrow(BoosterPackNotFoundException);
    });
  });

  describe('getCardsOfBoosterPack', () => {
    const darkMagicianContentData = {
      cardIds: [
        'Beast Fangs-Dark Magician',
        'Book of Secret Arts-Dark Magician',
        'Dark Hole-Dark Magician',
        'Dark Magician-Dark Magician',
        'Fissure-Dark Magician',
        'Gaia The Fierce Knight-Dark Magician',
        'Legendary Sword-Dark Magician',
        'Power of Kaishin-Dark Magician',
        'Trap Hole-Dark Magician',
        'Violet Crystal-Dark Magician',
        'Air Marmot of Nefariousness-Dark Magician',
        'Candle of Fate-Dark Magician',
        'Curtain of the Dark Ones-Dark Magician',
        'Dark Gray-Dark Magician',
        'Eyearmor-Dark Magician',
        "Fiend's Hand-Dark Magician",
        'Fire Reaper-Dark Magician',
        'Firegrass-Dark Magician',
        'Haniwa-Dark Magician',
        'Hitodenchak-Dark Magician',
        'Hitotsu-Me Giant-Dark Magician',
        'Hourglass of Life-Dark Magician',
        'Kagemusha of the Blue Flame-Dark Magician',
        'Kaminarikozou-Dark Magician',
        'Kurama-Dark Magician',
        'LaLa Li-oon-Dark Magician',
        'Mammoth Graveyard-Dark Magician',
        'Meotoko-Dark Magician',
        'Nemuriko-Dark Magician',
        'Petit Angel-Dark Magician',
        'Petit Dragon-Dark Magician',
        'Red Medicine-Dark Magician',
        'Sectarian of Secrets-Dark Magician',
        'Silver Fang-Dark Magician',
        'Sparks-Dark Magician',
        'The Drdek-Dark Magician',
        'The Furious Sea King-Dark Magician',
        'Tomozaurus-Dark Magician',
        'Wicked Mirror-Dark Magician',
        'Winged Cleaver-Dark Magician',
      ],
      id: 'Dark Magician',
      imgLink:
        'https://static.wikia.nocookie.net/yugioh/images/c/ce/DarkMagician-Booster-EDS.png/revision/latest?cb=20170126032525',
      name: 'Dark Magician',
      unlockCondition: 'Unlocked at the beginning of the game.',
    };

    it('gets the cards of a specific booster pack', () => {
      const darkMagicianCards = [
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
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            'A Warrior-type monster equipped with this card increases its ATK and DEF by 300 points.',
          id: 'Legendary Sword-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/d/db/LegendarySword-EDS-EN-VG.png/revision/latest?cb=20100228035127',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Legendary Sword',
          passcode: '61854111',
          property: 'Equip',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            'An Aqua-type monster equipped with this card increases its ATK and DEF by 300 points.',
          id: 'Power of Kaishin-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/f/fa/PowerofKaishin-EDS-EN-VG.png/revision/latest?cb=20100813222154',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Power of Kaishin',
          passcode: '77027445',
          property: 'Equip',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Trap',
          description:
            'If the ATK of a monster summoned by your opponent (excluding Special Summon) is 1000 points or more, the monster is destroyed.',
          id: 'Trap Hole-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/2/22/AcidTrapHole-EDS-EN-VG.png/revision/latest?cb=20140510160150',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Trap Hole',
          passcode: '04206964',
          property: 'Normal',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            'A Zombie-type monster equipped with this card increases its ATK and DEF by 300 points.',
          id: 'Violet Crystal-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/4/46/VioletCrystal-EDS-EN-VG.png/revision/latest?cb=20100829022411',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Violet Crystal',
          passcode: '15052462',
          property: 'Equip',
          rarity: 'Rare',
          status: 'Unlimited',
        },
        {
          atk: '400',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description: 'A horned beaver that dive-bombs enemies with acorns.',
          id: 'Air Marmot of Nefariousness-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/1/1b/ArchfiendMarmotofNefariousness-EDS-EN-VG.png/revision/latest?cb=20100305044013',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Beast'],
          name: 'Air Marmot of Nefariousness',
          passcode: '75889523',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'Decides the fate of an opponent when the candle on its fingertip burns out.',
          id: 'Candle of Fate-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/9/99/CandleofFate-EDS-EN-VG.png/revision/latest?cb=20100226070022',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Fiend'],
          name: 'Candle of Fate',
          passcode: '47695416',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '500',
          description:
            'A curtain that a spellcaster made. It is said to raise a dark power',
          id: 'Curtain of the Dark Ones-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/e/e6/CurtainoftheDarkOnes-EDS-EN-VG.png/revision/latest?cb=20140511003033',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Spellcaster'],
          name: 'Curtain of the Dark Ones',
          passcode: '22026707',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '800',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '900',
          description:
            'Entirely gray, this beast has rarely been seen by mortal eyes.',
          id: 'Dark Gray-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/5/5e/DarkGray-EDS-EN-VG.png/revision/latest?cb=20100818023824',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Beast'],
          name: 'Dark Gray',
          passcode: '09159938',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '500',
          description:
            'This warrior transforms into various creatures to confuse enemies in battle.',
          id: 'Eyearmor-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/9/9b/Eyearmor-EDS-EN-VG.png/revision/latest?cb=20100813220429',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Warrior'],
          name: 'Eyearmor',
          passcode: '64511793',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'Arms that reach out from the Swamp of Chaos to drag down the unwary.',
          id: "Fiend's Hand-Dark Magician",
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/69/FiendsHand-EDS-EN-VG.png/revision/latest?cb=20140514234825',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Zombie'],
          name: "Fiend's Hand",
          passcode: '52800428',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '500',
          description:
            'A reaper with a flaming arrow that burns an enemy to a crisp.',
          id: 'Fire Reaper-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/d/d0/FireReaper-EDS-EN-VG.png/revision/latest?cb=20100220184558',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Zombie'],
          name: 'Fire Reaper',
          passcode: '53581214',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description: 'A fire-breathing plant found growing near volcanoes',
          id: 'Firegrass-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/4/4a/Firegrass-EDS-EN-VG.png/revision/latest?cb=20100226043637',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Plant'],
          name: 'Firegrass',
          passcode: '53293545',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '500',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '500',
          description:
            'An earthen figure that protects the tomb of an ancient ruler.',
          id: 'Haniwa-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/1/17/Haniwa-EDS-EN-VG.png/revision/latest?cb=20140519100415',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Rock'],
          name: 'Haniwa',
          passcode: '84285623',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'WATER',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '700',
          description:
            'A rabid starfish that spits a lethal acid that can melt almost anything.',
          id: 'Hitodenchak-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/c/c0/Hitodenchak-EDS-EN-VG.png/revision/latest?cb=20140519231426',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Aqua'],
          name: 'Hitodenchak',
          passcode: '46718686',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '1200',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '1000',
          description:
            'A one-eyed behemoth with thick, powerful arms made for delivering punishing blows.',
          id: 'Hitotsu-Me Giant-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/1/1a/HitotsuMeGiant-EDS-EN-VG.png/revision/latest?cb=20140519231434',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 4,
          monsterTypes: ['Beast-Warrior'],
          name: 'Hitotsu-Me Giant',
          passcode: '76184692',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'LIGHT',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description: 'This creature grants power instead of shortening life.',
          id: 'Hourglass of Life-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/e/ef/HourglassofLife-EDS-EN-VG.png/revision/latest?cb=20100823041141',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Fairy', 'Normal'],
          name: 'Hourglass of Life',
          passcode: '08783685',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '800',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '400',
          description:
            "Serving as a double for the Ruler of the Blue Flame, he's a master swordsman that wields a fine blade.",
          id: 'Kagemusha of the Blue Flame-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/c/c8/KagemushaoftheBlueFlame-EDS-EN-VG.png/revision/latest?cb=20100821025013',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Warrior'],
          name: 'Kagemusha of the Blue Flame',
          passcode: '15401633',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'WIND',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'This monster stores electricity within its body, unleashing it with lethal effect.',
          id: 'Kaminarikozou-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/64/ThunderKid-EDS-EN-VG.png/revision/latest?cb=20140520215721',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Thunder'],
          name: 'Kaminarikozou',
          passcode: '15510988',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '800',
          attribute: 'WIND',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '800',
          description:
            'A vicious bird that attacks from the skies with its whip-like tail.',
          id: 'Kurama-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/9/98/Kurama-EDS-EN-VG.png/revision/latest?cb=20100822094513',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Winged Beast'],
          name: 'Kurama',
          passcode: '85705804',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'WIND',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'An electric cloud creature, its acid rain makes it very dangerous.',
          id: 'LaLa Li-oon-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/69/LaLaLiOon-EDS-EN-VG.png/revision/latest?cb=20100822094804',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Thunder'],
          name: 'LaLa Li-oon',
          passcode: '09430387',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '1200',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '800',
          description:
            'A mammoth that protects the graves of its pack and is absolutely merciless when facing grave-robbers.',
          id: 'Mammoth Graveyard-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/a/a9/MammothGraveyard-EDS-EN-VG.png/revision/latest?cb=20100924000605',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Dinosaur'],
          name: 'Mammoth Graveyard',
          passcode: '40374923',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'A huge monster with a single eye that fires a deadly beam.',
          id: 'Meotoko-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/1/1d/Meotoko-EDS-EN-VG.png/revision/latest?cb=20140522214845',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Beast'],
          name: 'Meotoko',
          passcode: '53832650',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '800',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '700',
          description:
            'A child-like creature that controls a sleep fiend to beckon enemies into eternal slumber.',
          id: 'Nemuriko-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/0/0f/Nemuriko-EDS-EN-VG.png/revision/latest?cb=20100228040028',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Spellcaster'],
          name: 'Nemuriko',
          passcode: '90963488',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'LIGHT',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '900',
          description:
            "A quick-moving and tiny fairy that's very difficult to hit.",
          id: 'Petit Angel-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/3/3a/PetitAngel-EDS-EN-VG.png/revision/latest?cb=20140529220544',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Fairy'],
          name: 'Petit Angel',
          passcode: '38142739',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '600',
          attribute: 'WIND',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '700',
          description: 'A very small dragon known for its vicious attacks.',
          id: 'Petit Dragon-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/4/4e/PetitDragon-EDS-EN-VG.png/revision/latest?cb=20100226055610',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Dragon'],
          name: 'Petit Dragon',
          passcode: '75356564',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description: 'Increases your Life Points by 500 points.',
          id: 'Red Medicine-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/69/RedMedicine-EDS-EN-VG.png/revision/latest?cb=20100828114639',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Red Medicine',
          passcode: '38199696',
          property: 'Normal',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '500',
          description:
            'A spellcaster that worships the dark, it is served by a sinister hand that drags enemies into oblivion.',
          id: 'Sectarian of Secrets-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/6/6d/SectarianofSecrets-EDS-EN-VG.png/revision/latest?cb=20100228042045',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Spellcaster'],
          name: 'Sectarian of Secrets',
          passcode: '15507080',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '1200',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '800',
          description:
            "A snow wolf that's beautiful to the eye, but absolutely vicious in battle.",
          id: 'Silver Fang-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/0/08/SilverFang-EDS-EN-VG.png/revision/latest?cb=20100818212247',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Beast'],
          name: 'Silver Fang',
          passcode: '90357090',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          boosterPack: 'Dark Magician',
          cardType: 'Spell',
          description:
            "Inflicts 200 points of Direct Damage to your opponent's Life Points.",
          id: 'Sparks-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/e/e5/Sparks-EDS-EN-VG.png/revision/latest?cb=20100919235342',
          isFusionMonster: false,
          isRitualMonster: false,
          name: 'Sparks',
          passcode: '76103675',
          property: 'Normal',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '800',
          description:
            'A bipedal eyeball that seldom misses an enemy with its lethal talons.',
          id: 'The Drdek-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/8/8e/TheDrdek-EDS-EN-VG.png/revision/latest?cb=20100820045016',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Fiend'],
          name: 'The Drdek',
          passcode: '08944575',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '800',
          attribute: 'WATER',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '700',
          description:
            "Grand King of the Seven Seas, he's able to summon massive tidal waves to drown the enemy.",
          id: 'The Furious Sea King-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/8/89/TheFuriousSeaKing-EDS-EN-VG.png/revision/latest?cb=20100718141147',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 3,
          monsterTypes: ['Aqua'],
          name: 'The Furious Sea King',
          passcode: '18710707',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '500',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '400',
          description:
            'Small but vicious, this monster even attacks its own kind.',
          id: 'Tomozaurus-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/f/f3/Tomozaurus-EDS-EN-VG.png/revision/latest?cb=20100228192708',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Dinosaur', 'Normal'],
          name: 'Tomozaurus',
          passcode: '46457856',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'DARK',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '600',
          description:
            'A wicked mirror that hypnotizes enemies, diverting attacks from their intended targets.',
          id: 'Wicked Mirror-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/5/53/ArchfiendMirror-EDS-EN-VG.png/revision/latest?cb=20100228194317',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Fiend'],
          name: 'Wicked Mirror',
          passcode: '15150371',
          rarity: 'Common',
          status: 'Unlimited',
        },
        {
          atk: '700',
          attribute: 'EARTH',
          boosterPack: 'Dark Magician',
          cardType: 'Monster',
          def: '700',
          description:
            'Few can withstand the scythe-like arms of this dangerous creature.',
          id: 'Winged Cleaver-Dark Magician',
          imgLink:
            'https://static.wikia.nocookie.net/yugioh/images/0/0a/WingedCleaver-EDS-EN-VG.png/revision/latest?cb=20100220183120',
          isFusionMonster: false,
          isRitualMonster: false,
          level: 2,
          monsterTypes: ['Insect'],
          name: 'Winged Cleaver',
          passcode: '39175982',
          rarity: 'Common',
          status: 'Unlimited',
        },
      ];
      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('boosterPacks', BoosterPack.DarkMagician)
        .mockReturnValue(darkMagicianContentData);
      darkMagicianContentData.cardIds.forEach((cardId) => {
        const card = darkMagicianCards.find((c) => c.id === cardId);
        when(
          contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional,
        )
          .calledWith('cards', cardId)
          .mockReturnValue(card as ICard);
      });

      const getCardsOfBoosterPack = service.getCardsOfBoosterPack(
        BoosterPack.DarkMagician,
      );

      expect(getCardsOfBoosterPack).toMatchObject(darkMagicianCards);
    });

    it('throws a CardNotFoundException', () => {
      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('boosterPacks', BoosterPack.DarkMagician)
        .mockReturnValue(darkMagicianContentData);

      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('cards', darkMagicianContentData.cardIds[0])
        .mockReturnValue(undefined);

      expect(() =>
        service.getCardsOfBoosterPack(BoosterPack.DarkMagician),
      ).toThrow(CardNotFoundException);
    });
  });

  describe('drawFromBoosterPack', () => {
    let uuidStandin = 0;
    const boosters: { uuid: string; contentId: BoosterPack }[] = [];
    Object.values(BoosterPack).forEach((boosterPack) => {
      boosters.push({
        uuid: (uuidStandin++).toString(),
        contentId: boosterPack,
      });
    });

    const darkMagicianContentData = {
      cardIds: [
        'Beast Fangs-Dark Magician',
        'Book of Secret Arts-Dark Magician',
        'Dark Hole-Dark Magician',
        'Dark Magician-Dark Magician',
        'Fissure-Dark Magician',
        'Gaia The Fierce Knight-Dark Magician',
        'Legendary Sword-Dark Magician',
        'Power of Kaishin-Dark Magician',
        'Trap Hole-Dark Magician',
        'Violet Crystal-Dark Magician',
        'Air Marmot of Nefariousness-Dark Magician',
        'Candle of Fate-Dark Magician',
        'Curtain of the Dark Ones-Dark Magician',
        'Dark Gray-Dark Magician',
        'Eyearmor-Dark Magician',
        "Fiend's Hand-Dark Magician",
        'Fire Reaper-Dark Magician',
        'Firegrass-Dark Magician',
        'Haniwa-Dark Magician',
        'Hitodenchak-Dark Magician',
        'Hitotsu-Me Giant-Dark Magician',
        'Hourglass of Life-Dark Magician',
        'Kagemusha of the Blue Flame-Dark Magician',
        'Kaminarikozou-Dark Magician',
        'Kurama-Dark Magician',
        'LaLa Li-oon-Dark Magician',
        'Mammoth Graveyard-Dark Magician',
        'Meotoko-Dark Magician',
        'Nemuriko-Dark Magician',
        'Petit Angel-Dark Magician',
        'Petit Dragon-Dark Magician',
        'Red Medicine-Dark Magician',
        'Sectarian of Secrets-Dark Magician',
        'Silver Fang-Dark Magician',
        'Sparks-Dark Magician',
        'The Drdek-Dark Magician',
        'The Furious Sea King-Dark Magician',
        'Tomozaurus-Dark Magician',
        'Wicked Mirror-Dark Magician',
        'Winged Cleaver-Dark Magician',
      ],
      id: 'Dark Magician',
      imgLink:
        'https://static.wikia.nocookie.net/yugioh/images/c/ce/DarkMagician-Booster-EDS.png/revision/latest?cb=20170126032525',
      name: 'Dark Magician',
      unlockCondition: 'Unlocked at the beginning of the game.',
    };

    it('draws the 5 selected cards from a specific booster pack for a user', () => {
      const trunk = [
        new UserCard('0', 'Beast Fangs-Dark Magician', 1),
        new UserCard('1', 'Book of Secret Arts-Dark Magician', 1),
        new UserCard('2', 'Dark Hole-Dark Magician', 1),
        new UserCard('3', 'Dark Magician-Dark Magician', 1),
        new UserCard('4', 'Fissure-Dark Magician', 1),
      ];
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('boosterPacks', BoosterPack.DarkMagician)
        .mockReturnValue(darkMagicianContentData);

      trunk.forEach((userCard) => {
        when(cardServiceMock.addToTrunk)
          .calledWith(user, userCard.contentId)
          .mockReturnValue(userCard as UserCard);
      });

      const drawFromBoosterPack = service.drawFromBoosterPack(
        user,
        BoosterPack.DarkMagician,
        {
          cardIds: [
            'Beast Fangs-Dark Magician',
            'Book of Secret Arts-Dark Magician',
            'Dark Hole-Dark Magician',
            'Dark Magician-Dark Magician',
            'Fissure-Dark Magician',
          ],
        },
      );

      expect(drawFromBoosterPack).toMatchObject(trunk);
    });

    it('throws a BoosterPackDoesNotContainCardException', () => {
      const user = Object.assign(
        new User('0', '0', '0', 0, boosters, '0', '0'),
      );

      when(contentAccessorServiceMock.getContentEntryByIdAndContentTypeOptional)
        .calledWith('boosterPacks', BoosterPack.DarkMagician)
        .mockReturnValue(darkMagicianContentData);

      expect(() =>
        service.drawFromBoosterPack(user, BoosterPack.DarkMagician, {
          cardIds: ['1', '2', '3', '4', '5'],
        }),
      ).toThrow(BoosterPackDoesNotContainCardException);
    });
  });
});

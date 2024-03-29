import * as t from 'io-ts';
export declare enum BoosterPack {
    DarkMagician = "Dark Magician",
    MysticalElf = "Mystical Elf",
    RedEyesBDragon = "Red-Eyes B. Dragon",
    JudgeMan = "Judge Man",
    BlueEyesWhiteDragon = "Blue-Eyes White Dragon",
    Exodia = "Exodia",
    CyberHarpie = "Cyber Harpie",
    TigerAxe = "Tiger Axe",
    GateGuardian = "Gate Guardian",
    GeminiElf = "Gemini Elf",
    LauncherSpider = "Launcher Spider",
    GreatMoth = "Great Moth",
    Garoozis = "Garoozis",
    Relinquished = "Relinquished",
    BattleOx = "Battle Ox",
    BlueEyesToonDragon = "Blue-Eyes Toon Dragon",
    BlackLusterSoldier = "Black Luster Soldier",
    BlueEyesUltimateDragon = "Blue-Eyes Ultimate Dragon",
    BlueMilleniumPuzzle = "Blue Millenium Puzzle",
    MilleniumEye = "Millenium Eye",
    BusterBlader = "Buster Blader",
    GreenMilleniumPuzzle = "Green Millenium Puzzle",
    MultiColoredMilleniumPuzzle = "Multi-colored Millenium Puzzle",
    weeklyYuGiOh1 = "Set 1",
    weeklyYuGiOh2 = "Set 2",
    Magazine = "Yu-Gi-Oh! Magazine",
    GrandpaCupQualifying = "Qualifying Round",
    GrandpaCupFinal = "Final"
}
export declare const boosterPackEnumT: t.Type<BoosterPack>;
export declare enum Rarity {
    Rare = "Rare",
    Common = "Common"
}
export declare const rarityEnumT: t.Type<Rarity>;
export declare enum CardType {
    Monster = "Monster",
    Spell = "Spell",
    Trap = "Trap"
}
export declare const cardTypeEnumT: t.Type<CardType>;
export declare enum Property {
    Normal = "Normal",
    Field = "Field",
    QuickPlay = "Quick-Play",
    Ritual = "Ritual",
    Continuous = "Continuous",
    Equip = "Equip",
    Counter = "Counter"
}
export declare const propertyEnumT: t.Type<Property>;
export declare enum MonsterType {
    Normal = "Normal",
    Effect = "Effect",
    Fusion = "Fusion",
    Ritual = "Ritual",
    Aqua = "Aqua",
    Beast = "Beast",
    BeastWarrior = "Beast-Warrior",
    Dinosaur = "Dinosaur",
    DivineBeast = "Divine-Beast",
    Dragon = "Dragon",
    Fairy = "Fairy",
    Fiend = "Fiend",
    Fish = "Fish",
    Insect = "Insect",
    Machine = "Machine",
    Plant = "Plant",
    Pyro = "Pyro",
    Reptile = "Reptile",
    Rock = "Rock",
    SeaSerpent = "Sea Serpent",
    Spellcaster = "Spellcaster",
    Thunder = "Thunder",
    Warrior = "Warrior",
    WingedBeast = "Winged Beast",
    Zombie = "Zombie"
}
export declare const monsterTypeEnumT: t.Type<MonsterType>;
export declare enum Attribute {
    Dark = "DARK",
    Divine = "DIVINE",
    Earth = "EARTH",
    Fire = "FIRE",
    Light = "LIGHT",
    Water = "WATER",
    Wind = "WIND"
}
export declare const attributeEnumT: t.Type<Attribute>;
export declare enum Status {
    Forbidden = "Forbidden",
    Limited = "Limited",
    SemiLimited = "Semi-Limited",
    Unlimited = "Unlimited"
}
export declare const StatusEnumT: t.Type<Status>;
export declare const AllowedByStatus: Record<Status, number>;
export interface ICard {
    id: string;
    name: string;
    description: string;
    boosterPack: BoosterPack;
    cardType: CardType;
    rarity: Rarity;
    imgLink: RequestInfo | URL;
    isFusionMonster: boolean;
    isRitualMonster: boolean;
    status: Status;
    property?: Property;
    passcode?: string;
    monsterTypes?: MonsterType[];
    atk?: string;
    def?: string;
    attribute?: Attribute;
    level?: number;
    ritualSpellCardName?: string;
    ritualMonsterRequired?: string;
    fusionMaterials?: string[];
}
export declare const cardT: t.Type<ICard>;
export interface ICardCopies extends ICard {
    copies: number;
}
export declare const cardCopiesT: t.Type<ICardCopies>;

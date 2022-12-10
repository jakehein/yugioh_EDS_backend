import * as t from 'io-ts';

export enum CardType {
  Monster = 'Monster',
  Magic = 'Magic',
  Trap = 'Trap',
}

export declare const cardTypeEnumT: t.Type<CardType>;

export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  VeryRare = 'VeryRare',
}

export declare const rarityEnumT: t.Type<Rarity>;

export enum Attribute {
  Dark = 'Dark',
  Earth = 'Earth',
  Fire = 'Fire',
  Light = 'Light',
  Water = 'Water',
  Wind = 'Wind',
}

export declare const attributeEnumT: t.Type<Attribute>;

export enum MonsterType {
  Aqua = 'Aqua',
  Beast = 'Beast',
  BeastWarrior = 'Beasts-Warrior',
  Dinosaur = 'Dinosaur',
  Divine = 'Divine',
  DivineBeast = 'Divine-Beast',
  Dragon = 'Dragon',
  Fairy = 'Fairy',
  Fiend = 'Fiend',
  Fish = 'Fish',
  Insect = 'Insect',
  Machine = 'Machine',
  Plant = 'Plant',
  Psychic = 'Psychic',
  Pyro = 'Pyro',
  Reptile = 'Reptile',
  Rock = 'Rock',
  SeaSerpent = 'Sea Serpent',
  Spellcaster = 'Spellcaster',
  Thunder = 'Thunder',
  Warrior = 'Warrior',
  WingedBeast = 'Winged Beast',
  Zombie = 'Zombie',
}

export declare const monsterTypeEnumT: t.Type<MonsterType>;

export interface ICard {
  id: string;
  name: string;
  cardType: CardType;
  rarity: Rarity;
  boosterPack: string;
  isFusion: boolean;
  isRitual: boolean;
  isEffect: boolean;
  isFlipEffect: boolean;
  password: string;
  effect: string;
  attribute?: Attribute;
  monsterType?: MonsterType;
  stars?: number;
  attack?: number;
  defense?: number;
}

export declare const cardT: t.Type<ICard>;

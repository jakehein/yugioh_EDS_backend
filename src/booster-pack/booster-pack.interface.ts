import * as t from 'io-ts';

export interface IBoosterPack {
  id: string;
  name: string;
  cards: string[];
  isUnlocked: boolean;
}

export declare const boosterPackT: t.Type<IBoosterPack>;

import * as t from 'io-ts';
import { IBoosterPack } from '../booster-pack/booster-pack.interface';
import { ICard } from '../card/card.interface';

export interface IContent {
  cards: ICard[];
  boosterPacks: IBoosterPack[];
}

export declare const contentT: t.Type<IContent>;

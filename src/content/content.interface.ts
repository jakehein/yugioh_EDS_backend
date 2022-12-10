import * as t from 'io-ts';
import { IBoosterPack } from '../booster-pack/booster-pack.interface';
import { ICard } from '../card/card.interface';
// import { IDeck } from 'src/deck/deck.interface';
// import { ISideDeck } from 'src/side-deck/side-deck.interfaces';

export interface IContent {
  cards: ICard[];
  //decks: IDeck[];
  //sideDecks: ISideDeck[];
  boosterPacks: IBoosterPack[];
}

export declare const contentT: t.Type<IContent>;

import { IBoosterPack } from 'src/booster-pack/booster-pack.interface';
import { ICard } from 'src/card/card.interface';
import { IDeck } from 'src/deck/deck.interface';
import { ISideDeck } from 'src/side-deck/side-deck.interfaces';

export interface IContent {
  cards: ICard[];
  decks: IDeck[];
  sideDecks: ISideDeck[];
  boosterPacks: IBoosterPack[];
}

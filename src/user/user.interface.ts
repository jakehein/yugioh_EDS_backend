import { IBoosterPack } from '../booster-pack/booster-pack.interface';
import { IDeck } from '../deck/deck.interface';
import { ISideDeck } from '../side-deck/side-deck.interfaces';

export interface IUser {
  id: string;
  name: string;
  decks: IDeck[];
  sideDecks: ISideDeck[];
  currentDeck: IDeck;
  currentSideDeck: ISideDeck;
  boostersAvailable: IBoosterPack[];
  boostersCompleted: IBoosterPack[];
}

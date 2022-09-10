import { IBoosterPack } from 'src/booster-pack/booster-pack.interface';
import { IDeck } from 'src/deck/deck.interface';
import { ISideDeck } from 'src/side-deck/side-deck.interfaces';

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

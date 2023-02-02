import { ICard } from '../card/card.interface';
import { CardContentId } from '../user/user.schema';

interface IDeckBase {
  id: string;
  name: string;
  deckSize: number;
  monsters: number;
  traps: number;
  spells: number;
  fusionMonsters: number;
  ritualMonsters: number;
}

export interface IDeck extends IDeckBase {
  cards: CardContentId[];
}

export interface IDeckContent extends IDeckBase {
  cards: ICard[];
}

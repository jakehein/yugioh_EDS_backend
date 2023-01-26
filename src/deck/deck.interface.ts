import { ICard } from '../card/card.interface';

interface IDeckShared {
  id: string;
  monsters: number;
  traps: number;
  spells: number;
  fusionMonsters: number;
  ritualMonsters: number;
}

export interface IDeck extends IDeckShared {
  cards: string[];
}

export interface IDeckContent extends IDeckShared {
  cards: ICard[];
}

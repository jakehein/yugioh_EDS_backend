import { ICard } from 'src/card/card.interface';

export interface ISideDeck {
  id: string;
  monsters: number;
  traps: number;
  spells: number;
  fusionMonsters: number;
  ritualMonsters: number;
  cards: ICard[];
}

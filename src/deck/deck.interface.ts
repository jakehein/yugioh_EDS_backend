import { ICard } from '../card/card.interface';

export interface IDeck {
  id: string;
  monsters: number;
  traps: number;
  spells: number;
  fusionMonsters: number;
  ritualMonsters: number;
  cards: ICard[];
}

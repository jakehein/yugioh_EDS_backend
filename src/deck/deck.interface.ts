import { ICard } from 'src/card/card.interface';

export interface IDeck {
  id: string;
  monsters: number;
  traps: number;
  spells: number;
  fusionMonsters: number;
  ritualMonsters: number;
  cards: ICard[];
}

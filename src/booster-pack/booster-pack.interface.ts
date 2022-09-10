import { ICard } from 'src/card/card.interface';

export interface IBoosterPack {
  id: string;
  name: string;
  cards: ICard[];
  isUnlocked: boolean;
}

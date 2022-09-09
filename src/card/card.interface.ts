export interface ICard {
  id: string;
  name: string;
  cardType: CardType;
  rarity: Rarity;
  boosterPack: string;
  isFusion: boolean;
  password: number | null;
  effect: string;
  attribute: Attribute | null;
  monsterType: MonsterType | null;
  stars: number | null;
  attack: number | null;
  defense: number | null;
}

import { Injectable } from '@nestjs/common';
import { ICard } from './card.interface';

@Injectable()
export class CardService {
  getCardById(cardId: string): ICard {
    return null;
  }
}

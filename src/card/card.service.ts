import { Injectable } from '@nestjs/common';
import { ICard } from './card.interface';
import { User } from '../user/user.schema';

@Injectable()
export class CardService {
  getCard(user: User, cardId: string): ICard | null {
    return null;
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { ICard } from './card.interface';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('id')
  async GetCardById(@Param('cardId') cardId: string): Promise<ICard> {
    return this.cardService.getCardById(cardId);
  }
}

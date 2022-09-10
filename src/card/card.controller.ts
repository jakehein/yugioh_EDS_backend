import { Controller, Get, Post } from '@nestjs/common';

@Controller('card')
export class CardController {
  @Get()
  async GetCardById(): Promise<null> {
    return null;
  }

  @Post()
  async AddCardToUser() {
    return null;
  }
}

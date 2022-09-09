import { Controller, Get } from '@nestjs/common';

@Controller('card')
export class CardController {
  @Get()
  GetCardById(): Promise<null> {
    return null;
  }
}

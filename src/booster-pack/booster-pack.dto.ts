import { BoosterPackStringArrayApiDecorator } from '../_util/decorators/compoundDecorators';

export class CardIdsDto {
  @BoosterPackStringArrayApiDecorator()
  cardIds!: [string, string, string, string, string];
}

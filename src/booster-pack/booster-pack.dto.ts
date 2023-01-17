import { StringArrayApiDecorator } from '../_util/decorators/compoundDecorators';

export class CardIdsDto {
  @StringArrayApiDecorator()
  cardIds!: [string, string, string, string, string];
}

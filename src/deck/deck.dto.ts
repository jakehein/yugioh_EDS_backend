import { StringArrayApiDecorator } from '../_util/decorators/compoundDecorators';
import { CardContentId } from '../user/user.schema';

export class CardContentIdsDto {
  @StringArrayApiDecorator()
  cardContentIds!: CardContentId[];
}

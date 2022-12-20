import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class UsersValidationService {
  constructor(
    private readonly contentAccessorService: ContentAccessorService,
  ) {}

  /**
   * Check user for all cards in trunk and validate cards exist in contentAccessorService.
   * Remove invalid cards from user
   * @param user the user to validate all cards for
   */
  validateAllCardsInTrunkExist(user: User) {
    if (user.trunk.length > 0) {
      const itemsNeedDeleting = user.trunk.filter(
        (x) =>
          !this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
            'cards',
            x.contentId,
          ),
      );
      itemsNeedDeleting.forEach((x) => _.remove(user.trunk, x));
    }
  }
}

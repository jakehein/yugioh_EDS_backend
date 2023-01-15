import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';

@Injectable()
export class UsersValidationService {
  constructor(
    private readonly contentAccessorService: ContentAccessorService,
    private readonly uuidService: UuidService,
  ) {}

  validateUserFields(user: User) {
    this.validateAllCardsInTrunkExist(user);
    this.validateAllBoosterPacksExist(user);
    this.validateCardsExistOnBoosterPacksAvailable(user);
  }

  /**
   * Check user for all cards in trunk and validate cards exist in contentAccessorService.
   * Remove invalid cards from user
   * @param user the user to validate all cards for
   */
  private validateAllCardsInTrunkExist(user: User) {
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

  /**
   * Check user for all booster packs and validate booster packs exist in contentAccessorService.
   * Remove invalid booster packs from user
   * @param user the user to validate all booster packs for
   */
  private validateAllBoosterPacksExist(user: User) {
    if (user.boostersAvailable.length > 0) {
      const itemsNeedDeleting = user.boostersAvailable.filter(
        (x) =>
          !this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
            'boosterPacks',
            x.contentId,
          ),
      );
      itemsNeedDeleting.forEach((x) => _.remove(user.boostersAvailable, x));
    }
  }

  /**
   * Check user for all booster packs and validate that the cardIds[]
   * on the booster pack isn't empty.
   * @param user the user to validate all booster packs for
   */
  private validateCardsExistOnBoosterPacksAvailable(user: User) {
    const boosterPacksAvailable: UserBoosterPack[] = [];
    if (user.boostersAvailable.length > 0) {
      user.boostersAvailable.forEach((currentBoosterPack) => {
        const contentBoosterPack =
          this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
            'boosterPacks',
            currentBoosterPack.contentId,
          );

        if (!contentBoosterPack) throw new Error('booster pack does not exist');

        if (currentBoosterPack.cardIds.length < 1) {
          const cardIds = contentBoosterPack.cardIds.map((cardId) => {
            const userCard: UserCard = new UserCard(
              this.uuidService.getUuid(),
              cardId,
            );
            // check trunk for this card to validate if it's been drawn already
            const userCardInTrunk = user.trunk.find(
              (card) => card.contentId === cardId,
            );
            if (userCardInTrunk) {
              userCard.copies = userCardInTrunk.copies;
            }

            return userCard;
          });
          const userBoosterPack = new UserBoosterPack(
            currentBoosterPack.id,
            currentBoosterPack.contentId,
            cardIds,
          );

          userBoosterPack.isUnlocked = currentBoosterPack.isUnlocked;
          boosterPacksAvailable.push(userBoosterPack);
        } else {
          boosterPacksAvailable.push(currentBoosterPack);
        }
      });

      user.boostersAvailable = boosterPacksAvailable;
    }
  }
}

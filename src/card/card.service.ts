import { Injectable } from '@nestjs/common';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
import { ContentAccessorService } from '../content/content-accessor.service';
import { ICard, ICardCopies } from './card.interface';

//FIXME: might need to group by passcode or something
// might be issue when 2 codes point to 1 card name with 5 different ids
// 5 different cards would be populated, but we would only have 1 actual card
// per add to the trunk
@Injectable()
export class CardService {
  constructor(
    private readonly uuidService: UuidService,
    private readonly contentAccessorService: ContentAccessorService,
  ) {}

  /**
   * Get the card content data
   * @param cardId cardId of the card being retrieved
   * @returns ICard content data
   */
  getCardContent(cardId: string, copies = 0): ICard | ICardCopies {
    const card =
      this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
        'cards',
        cardId,
      );

    if (!card) throw new Error('card does not exist');

    if (copies) {
      return card;
    } else {
      return { ...card, copies };
    }
  }

  /**
   * Get the contents of the card trunk
   * @param user user owning the trunk
   * @returns the trunk
   */
  getTrunk(user: User): UserCard[] {
    return user.trunk;
  }

  /**
   * Get the content data of the card trunk
   * @param user user retrieving the contents of their trunk
   * @returns the trunk's content data
   */
  getTrunkContents(user: User): ICardCopies[] {
    const trunkContent: ICardCopies[] = [];
    const userTrunk = this.getTrunk(user);

    userTrunk.forEach((x) => {
      trunkContent.push(
        this.getCardContent(x.contentId, x.copies) as ICardCopies,
      );
    });

    return trunkContent;
  }

  /**
   * Get a card from the trunk
   * @param user user owning the card
   * @param cardId card being retrieved
   * @returns the card or null if it doesn't exist
   */
  getCardFromTrunk(user: User, cardId: string): UserCard | null {
    return user.trunk.find((card) => card.contentId === cardId) ?? null;
  }

  /**
   * Add a card to the trunk
   * @param user user getting the card
   * @param cardId cardId being added
   * @returns the trunk
   */
  addToTrunk(user: User, cardId: string): UserCard {
    let card = this.getCardFromTrunk(user, cardId);
    if (card) {
      //make sure this actually saves correctly
      ++card.copies;
    } else {
      const uuid = this.uuidService.getUuid();
      card = new UserCard(uuid, cardId, 1);
      user.trunk.push(card);
    }
    this.updateBoosterPackCard(user, card);
    return card;
  }

  /**
   * Add cards to the trunk given a passcode. Note: One passcode
   * can be linked to multiple cardIds, ex: 'Dark Magician-Dark Magician'
   * and 'Dark Magician-Blue-Eyes White Dragon' both have passcode 46986414
   * @param user user getting the cards
   * @param passcode passcode of the cards being added to the trunk
   * @returns the cards that were added to the trunk
   */
  addToTrunkByPasscode(user: User, passcode: string): UserCard[] {
    const userCards: UserCard[] = [];
    const contentCards =
      this.contentAccessorService.getAllContentCardsByPasscode(passcode);

    contentCards.forEach((card) => {
      const userCard = this.addToTrunk(user, card.id);
      userCards.push(userCard);
    });

    return userCards;
  }

  /**
   * Check if boostersCompleted needs updating and return the
   * values that are added if there are any
   * @param user user with the boosters being checked
   * @returns UserBoosterPack[] elements added after check
   */
  checkBoostersCompletedForUser(user: User): UserBoosterPack[] {
    const boostersAvailable = user.boostersAvailable;
    const boostersCompleted = user.boostersCompleted;

    return boostersAvailable.filter((currentBoosterPack) => {
      const unobtainedUserCard = currentBoosterPack.cardIds.find(
        (x) => x.copies === 0,
      );
      if (!unobtainedUserCard) {
        const completedBoosterPack = boostersCompleted.find(
          (x) => x.contentId === currentBoosterPack.contentId,
        );
        if (!completedBoosterPack) {
          user.boostersCompleted.push(currentBoosterPack);
          return true;
        }
      }
      return false;
    });
  }

  /**
   * Update the boostersAvailable for the user with newly added UserCard
   * @param user user getting the card
   * @param card UserCard added that needs updating in UserBoosterPack list
   */
  private updateBoosterPackCard(user: User, card: UserCard): void {
    user.boostersAvailable.find((x) => {
      const boosterCard: UserCard | undefined = x.cardIds.find(
        (y) => y.contentId === card.contentId,
      );
      if (!boosterCard) {
        throw new Error('Card does not exist on booster');
      }
      ++boosterCard.copies;
    });
  }

  /**
   * Get the number of copies a user has of a card by a given cardName
   * Note: The user can ignore the id and boosterName of the card.
   * These might be filtered out at a later time...
   * @param user user retrieving the card data grouped by passcode
   * @param cardName name of the card being filtered on
   * @returns a list of ICards with the number of copies the user has
   */
  getGeneralCardDataBasedOnPasscode(
    user: User,
    cardName: string,
  ): ICardCopies[] {
    const cardContents = this.getTrunkContents(user);
    const cardsWithName = cardContents.filter((x) => x.name === cardName);
    const cardPasscodes: string[] = [];
    const cardsData: ICardCopies[] = cardsWithName.filter((card) => {
      if (card.passcode && !cardPasscodes.includes(card.passcode)) {
        cardPasscodes.push(card.passcode);
        return true;
      } else {
        return false;
      }
    });

    return cardsData;
  }
}

import { Injectable } from '@nestjs/common';
import { User, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';
import { ContentAccessorService } from '../content/content-accessor.service';

@Injectable()
export class CardService {
  constructor(
    private readonly uuidService: UuidService,
    private readonly contentAccessorService: ContentAccessorService,
  ) {}

  /**
   * Get the contents of the card trunk
   * @param user user owning the trunk
   * @returns the trunk
   */
  getTrunk(user: User): UserCard[] {
    return user.trunk;
  }

  /**
   * Get a card from the trunk
   * @param user user owning the card
   * @param cardId card being retrieved
   * @returns the card or null if it doesn't exist
   */
  getCard(user: User, cardId: string): UserCard | null {
    return user.trunk.find((card) => card.contentId === cardId) ?? null;
  }

  /**
   * Add a card to the trunk
   * @param user user getting the card
   * @param cardId cardId being added
   * @returns the trunk
   */
  addToTrunk(user: User, cardId: string): UserCard {
    let card = this.getCard(user, cardId);
    if (card) {
      ++card.copies;
      return card;
    } else {
      const uuid = this.uuidService.getUuid();
      card = new UserCard(uuid, cardId);
      user.trunk.push(card);
      return card;
    }
  }

  /**
   * Add cards to the trunk given a passcode
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

    // TODO: need to add these cards to the userBoosterPack list?

    return userCards;
  }

  //getCardsInTrunkByCertainParam
}

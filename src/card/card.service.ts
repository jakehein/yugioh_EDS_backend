import { Injectable } from '@nestjs/common';
import { User, UserCard } from '../user/user.schema';
import { UuidService } from '../uuid/uuid.service';

@Injectable()
export class CardService {
  constructor(private readonly uuidService: UuidService) {}

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
  addToTrunk(user: User, cardId: string): UserCard[] {
    const cardInTrunk = this.getCard(user, cardId);

    if (cardInTrunk) {
      ++cardInTrunk.copies;
    } else {
      const uuid = this.uuidService.getUuid();
      const card = new UserCard(uuid, cardId);
      user.trunk.push(card);
    }
    return this.getTrunk(user);
  }
}

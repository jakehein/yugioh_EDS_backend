import { Injectable } from '@nestjs/common';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { BoosterPack, ICard } from '../card/card.interface';
import { IBoosterPack } from './booster-pack.interface';
import { CardService } from '../card/card.service';
import {
  BoosterPackDoesNotContainCardException,
  BoosterPackIsAlreadyUnlockedException,
  BoosterPackNotFoundException,
  CardNotFoundException,
} from '../content-errors';

@Injectable()
export class BoosterPackService {
  constructor(
    private readonly contentAccessorService: ContentAccessorService,
    private readonly cardService: CardService,
  ) {}

  /**
   * Get the list of booster packs available to the user
   * @param user user retrieving their available booster packs
   * @returns list of user's booster packs
   */
  getAvailableBoosters(user: User): UserBoosterPack[] {
    return user.boostersAvailable;
  }

  /**
   * Get the list of booster packs available to the user
   * that are unlocked by the user
   * @param user user retrieving their available booster packs
   * @returns list of user's booster packs
   */
  getUnlockedAvailableBoosters(user: User): UserBoosterPack[] {
    return user.boostersAvailable.filter((booster) => booster.isUnlocked);
  }

  /**
   * Unlock a booster pack for the user given a boosterId
   * @param user user unlocking a booster pack in their list of available packs
   * @param boosterId the content id of the pack being unlocked
   * @returns the UserBoosterPack unlocked
   */
  unlockAvailableBooster(user: User, boosterId: BoosterPack): UserBoosterPack {
    const userBoosterPack = user.boostersAvailable.find(
      (booster) => booster.contentId === boosterId,
    );

    if (!userBoosterPack) {
      throw new BoosterPackNotFoundException(boosterId);
    }

    if (userBoosterPack.isUnlocked) {
      throw new BoosterPackIsAlreadyUnlockedException(boosterId);
    }
    userBoosterPack.isUnlocked = !userBoosterPack.isUnlocked;

    return userBoosterPack;
  }

  /**
   * Get the list of booster packs completed to the user
   * @param user user retrieving their completed booster packs
   * @returns list of user's booster packs
   */
  getCompletedBoosters(user: User): UserBoosterPack[] {
    return user.boostersCompleted;
  }

  /**
   * Get the content data of the booster pack given an id
   * @param boosterId the contentId of the boosterPack being retrieved from
   * the content layer
   * @returns an IBoosterPack object from the content layer
   */
  getBoosterPackContent(boosterId: BoosterPack): IBoosterPack {
    const boosterPack =
      this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
        'boosterPacks',
        boosterId,
      );

    if (!boosterPack) throw new BoosterPackNotFoundException(boosterId);

    return boosterPack;
  }

  /**
   * Get the content data cards of a booster pack given a boosterId
   * @param boosterId the content id of the booster being retrieved
   * @returns an array of ICards from the content layer
   */
  getCardsOfBoosterPack(boosterId: BoosterPack): ICard[] {
    const cardIds = this.getBoosterPackContent(boosterId).cardIds;

    const cards = cardIds.map((cardId) => {
      const card =
        this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
          'cards',
          cardId,
        );
      if (!card) throw new CardNotFoundException(cardId);
      return card;
    });
    return cards;
  }

  /**
   * Draw 5 cards from a booster pack and add them to the user.
   * The 5 cards are retrieved by their contentIds and checked
   * against the boosterId to make sure they exist on the given booster.
   * @param user the user gaining the cards
   * @param boosterId the booster being drawn from
   * @param cardData the card
   * @returns
   */
  drawFromBoosterPack(
    user: User,
    boosterId: BoosterPack,
    cardData: { cardIds: [string, string, string, string, string] },
  ): UserCard[] {
    const userCards: UserCard[] = [];
    const boosterPack = this.getBoosterPackContent(boosterId);

    cardData.cardIds.forEach((cardId) => {
      if (!boosterPack.cardIds.includes(cardId)) {
        throw new BoosterPackDoesNotContainCardException(boosterId, cardId);
      }
      userCards.push(this.cardService.addToTrunk(user, cardId));
    });

    return userCards;
  }
}

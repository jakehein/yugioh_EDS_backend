import { Injectable } from '@nestjs/common';
import { CardService } from '../card/card.service';
import { User, UserDeck, CardContentId } from '../user/user.schema';
import { IDeckContent } from './deck.interface';
import { AllowedByStatus, CardType, Status } from '../card/card.interface';
import { UuidService } from '../uuid/uuid.service';
import {
  CardCopyLimitReachedException,
  CardNotFoundException,
  ForbiddenCardException,
  InvalidDeckException,
} from '../content-errors';

@Injectable()
export class DeckService {
  constructor(
    private readonly cardService: CardService,
    private readonly uuidService: UuidService,
  ) {}

  /**
   * Get the current deck that's registered by the user
   * @param user user retrieving their current deck
   * @returns the current deck
   */
  getCurrentDeck(user: User): UserDeck {
    // might want to return a special base case of empty
    // for displaying first instance to user?
    const currentDeck = user.currentDeck;
    if (currentDeck.cards.length < 40) {
      throw new InvalidDeckException(currentDeck.id, currentDeck.cards.length);
    }
    return currentDeck;
  }

  /**
   * Get all the decks the user has registered
   * @param user user retrieving their registered decks
   * @returns the registered decks of the user
   */
  getDecks(user: User): UserDeck[] {
    //do I want the same sort of error checking here as for current deck?
    return user.decks;
  }

  /**
   * Get the deck data of the users current deck
   * @param user user retrieving the content of their current deck
   * @returns the current deck content being retrieved
   */
  getCurrentDeckContents(user: User): IDeckContent {
    const deck = this.getCurrentDeck(user);
    const deckData: IDeckContent = {
      id: deck.id,
      name: deck.name,
      deckSize: 0,
      monsters: 0,
      traps: 0,
      spells: 0,
      fusionMonsters: 0,
      ritualMonsters: 0,
      cards: [],
    };

    deck.cards.forEach((cardContentId) => {
      const cardContent = this.cardService.getCardContent(cardContentId);

      switch (cardContent.cardType) {
        case CardType.Monster:
          if (cardContent.isFusionMonster) {
            deckData.fusionMonsters++;
          } else if (cardContent.isRitualMonster) {
            deckData.ritualMonsters++;
          }
          deckData.monsters++;
          break;
        case CardType.Spell:
          deckData.spells++;
          break;
        case CardType.Trap:
          deckData.traps++;
          break;
      }

      if (!cardContent.isFusionMonster) {
        deckData.deckSize++;
      }
      deckData.cards.push(cardContent);
    });

    return deckData;
  }

  /**
   * Update the currentDeck of the user with new Cards supplied by user
   * @param user user updating their currentDeck
   * @param cardContentIds cards being updated for the user
   * @returns the new userDeck
   */
  updateCurrentDeck(
    user: User,
    cardContentIds: { cardContentIds: CardContentId[] },
  ): UserDeck {
    type CardName = string;
    type CopiesAllowed = {
      copies: number;
      allowedByStatus: number;
    };

    const cardsCopiesAllowed: Map<CardName, CopiesAllowed> = new Map();

    cardContentIds.cardContentIds.forEach((cardContentId) => {
      const cardContent = this.cardService.getCardContent(cardContentId);
      const cardCopyAllowed = cardsCopiesAllowed.get(cardContent.name);

      if (!cardCopyAllowed) {
        if (cardContent.status === Status.Forbidden) {
          throw new ForbiddenCardException(cardContentId);
        }

        cardsCopiesAllowed.set(cardContent.name, {
          copies: 1,
          allowedByStatus: AllowedByStatus[cardContent.status],
        });
      } else {
        if (cardCopyAllowed.copies >= cardCopyAllowed.allowedByStatus) {
          throw new CardCopyLimitReachedException(
            cardCopyAllowed.allowedByStatus,
            cardContent.name,
          );
        }
        cardCopyAllowed.copies++;
      }
    });

    // creating a new object to enable flushing to DB
    const userDeck = new UserDeck(
      this.uuidService.getUuid(),
      user.currentDeck.name,
      cardContentIds.cardContentIds,
    );

    user.currentDeck = userDeck;
    return user.currentDeck;
  }
}

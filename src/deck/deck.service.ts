import { Injectable } from '@nestjs/common';
import { ContentAccessorService } from '../content/content-accessor.service';
import { CardService } from '../card/card.service';
import { User, UserDeck, CardContentId } from '../user/user.schema';
import { IDeckContent } from './deck.interface';
import { AllowedByStatus, CardType, Status } from '../card/card.interface';
import { number } from 'io-ts';

@Injectable()
export class DeckService {
  constructor(
    private readonly contentAccessorService: ContentAccessorService,
    private readonly cardService: CardService,
  ) {}

  /**
   * Get the current deck that's registered by the user
   * @param user user retrieving their current deck
   * @returns the current deck
   */
  getCurrentDeck(user: User): UserDeck {
    return user.currentDeck;
  }

  /**
   * Get all the decks the user has registered
   * @param user user retrieving their registered decks
   * @returns the registered decks of the user
   */
  getDecks(user: User): UserDeck[] {
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
      const cardContent =
        this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
          'cards',
          cardContentId,
        );

      if (!cardContent) throw new Error('Card does not exist');

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

  updateCurrentDeck(user: User, cardContentIds: CardContentId[]) {
    type CardName = string;
    type CopiesAllowed = {
      copies: number;
      allowedByStatus: number;
    };

    const cardsCopiesAllowed: Map<CardName, CopiesAllowed> = new Map();

    cardContentIds.forEach((cardContentId) => {
      const cardContent = this.cardService.getCardContent(cardContentId);
      const cardCopyAllowed = cardsCopiesAllowed.get(cardContent.name);

      if (!cardCopyAllowed) {
        if (cardContent.status === Status.Forbidden) {
          throw new Error('Egyptian God Cards Are Forbidden');
        }

        cardsCopiesAllowed.set(cardContent.name, {
          copies: 1,
          allowedByStatus: AllowedByStatus[cardContent.status],
        });
      } else {
        if (cardCopyAllowed.copies >= cardCopyAllowed.allowedByStatus) {
          throw new Error(
            `Only allowed to add ${cardCopyAllowed.allowedByStatus} copies of ${cardContent.name}`,
          );
        }
        cardCopyAllowed.copies++;
      }
    });

    //FINISH THE THOUGHT...

    // const a = cardContentIds.map((cardContentId) => {
    //   this.cardService.getCardContent(cardContentId);
    //   return { cardName: 'a', status: 'b' };
    // });
    // cardContentIds.forEach((cardContentId) => {

    // });

    //const cardName = this.cardService.getCardContent(cardContentId).name;

    // const copiesOfCardIdInDeck = user.currentDeck.cards.filter(
    //   (x) => x === cardName,
    // ).length;
    // const cardInTrunk = this.cardService.getCardFromTrunk(user, cardContentId);

    // if (!cardInTrunk) throw new Error('Card not in trunk');

    // if (
    //   copiesOfCardIdInDeck > 0 &&
    //   cardInTrunk.copies > copiesOfCardIdInDeck &&
    //   copiesOfCardIdInDeck <= 3
    // ) {
    //   //add card to deck
    //   updateDeck.cards.push(cardName);
    // } else {
    //   throw new Error('Cannot add card to deck, all copies currently added');
    // }
  }
}

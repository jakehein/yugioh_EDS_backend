import { Injectable } from '@nestjs/common';
import { ContentAccessorService } from '../content/content-accessor.service';
import { CardService } from '../card/card.service';
import { User, UserDeck } from '../user/user.schema';
import { IDeckContent } from './deck.interface';
import { CardType } from '../card/card.interface';

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
      monsters: 0,
      traps: 0,
      spells: 0,
      fusionMonsters: 0,
      ritualMonsters: 0,
      cards: [],
    };

    //FIXME: probably change this to use passcode instead?
    deck.cards.forEach((cardName) => {
      const cardContent = this.cardService.getCardFromTrunk(user);
      // const cardContent =
      //   this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
      //     'cards',
      //     userCard.contentId,
      //   );

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
      deckData.cards.push(cardContent);
    });

    return deckData;
  }

  //TODO: should this be changed to add based on passcode?
  addCardToDeck(user: User, deckId: string, cardId: string) {
    const updateDeck = user.decks.find((x) => x.id === deckId);
    if (!updateDeck) throw new Error('Deck does not exist');
    const cardName = this.cardService.getCardContent(cardId).name;

    const copiesOfCardIdInDeck = updateDeck.cards.filter(
      (x) => x === cardName,
    ).length;
    const cardInTrunk = this.cardService.getCardFromTrunk(user, cardId);

    if (!cardInTrunk) throw new Error('Card not in trunk');

    if (
      copiesOfCardIdInDeck > 0 &&
      cardInTrunk.copies > copiesOfCardIdInDeck &&
      copiesOfCardIdInDeck <= 3
    ) {
      //add card to deck
      updateDeck.cards.push(cardName);
    } else {
      throw new Error('Cannot add card to deck, all copies currently added');
    }
  }
}

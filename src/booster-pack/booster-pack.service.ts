import { Injectable } from '@nestjs/common';
import { ContentAccessorService } from '../content/content-accessor.service';
import { User, UserBoosterPack, UserCard } from '../user/user.schema';
import { BoosterPack, ICard } from '../card/card.interface';
import { IBoosterPack } from './booster-pack.interface';
import { CardService } from '../card/card.service';

@Injectable()
export class BoosterPackService {
  constructor(
    private readonly contentAccessorService: ContentAccessorService,
    private readonly cardService: CardService,
  ) {}

  getAvailableBoosters(user: User): UserBoosterPack[] {
    return user.boostersAvailable;
  }

  getCompletedBoosters(user: User): UserBoosterPack[] {
    return user.boostersCompleted;
  }

  getBoosterPackContent(boosterId: BoosterPack): IBoosterPack {
    const boosterPack =
      this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
        'boosterPacks',
        boosterId,
      );

    if (!boosterPack) throw new Error('boosterPack does not exist');

    return boosterPack;
  }

  getCardsOfBoosterPack(boosterId: BoosterPack): ICard[] {
    const cardIds = this.getBoosterPackContent(boosterId).cardIds;

    const cards = cardIds.map((x) => {
      const card =
        this.contentAccessorService.getContentEntryByIdAndContentTypeOptional(
          'cards',
          x,
        );
      if (!card) throw new Error('card content does not exist');
      return card;
    });
    return cards;
  }

  drawFromBoosterPack(
    user: User,
    boosterId: BoosterPack,
    cardIds: [string, string, string, string, string],
  ): UserCard[] {
    const userCards: UserCard[] = [];
    const boosterPack = this.getBoosterPackContent(boosterId);

    cardIds.forEach((x) => {
      if (!boosterPack.cardIds.includes(x))
        throw new Error('card does not exist in boosterPack');
      userCards.push(this.cardService.addToTrunk(user, x));
    });

    return userCards;
  }
}

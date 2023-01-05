import { Injectable } from '@nestjs/common';
import { IContent } from './content.interface';
import { ContentService } from './content.service';

type ContentItem = IContent[keyof IContent][number];

type ContentEntry<K extends keyof IContent> = IContent[K][number];

type ContentEntryMap<T extends ContentItem> = Record<T['id'], T>;

type ContentMap = {
  [Prop in keyof IContent]: ContentEntryMap<IContent[Prop][number]>;
};

@Injectable()
export class ContentAccessorService {
  private contentByTypeAndId!: ContentMap;

  constructor(private readonly contentService: ContentService) {
    this.unpackContent(contentService.get());
  }

  private unpackContent(content: IContent): void {
    this.contentByTypeAndId = {
      boosterPacks: {},
      cards: {},
    };

    const contentTypes = Object.keys(content) as (keyof IContent)[];

    contentTypes.forEach((type) => {
      content[type].forEach((item: ContentItem) => {
        this.contentByTypeAndId[type][item.id] = item;
      });
    });
  }

  getContentData() {
    return this.contentService.get();
  }

  getContentEntryByIdAndContentTypeOptional<K extends keyof IContent>(
    type: K,
    id: ContentEntry<K>['id'],
  ): ContentEntry<K> | undefined {
    if (!(id in this.contentByTypeAndId[type])) {
      return undefined;
    }

    return this.contentByTypeAndId[type][id];
  }

  getAllContentEntriesByContentType<K extends keyof IContent>(
    type: K,
  ): ContentEntry<K>[] {
    return Object.values<ContentEntry<K>>(this.contentByTypeAndId[type]);
  }

  getContentEntryByName<K extends keyof IContent>(
    type: K,
    name: ContentEntry<K>['name'],
  ): ContentEntry<K> | undefined {
    return this.getAllContentEntriesByContentType(type).find(
      (item) => item.name === name,
    );
  }

  getAllContentCardsByPasscode(passcode: string): ContentEntry<'cards'>[] {
    return this.getAllContentEntriesByContentType('cards').filter(
      (card) => card.passcode === passcode,
    );
  }
}

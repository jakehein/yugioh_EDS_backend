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
  }
}

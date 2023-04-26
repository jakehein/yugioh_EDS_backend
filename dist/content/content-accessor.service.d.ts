import { IContent } from './content.interface';
import { ContentService } from './content.service';
declare type ContentEntry<K extends keyof IContent> = IContent[K][number];
export declare class ContentAccessorService {
    private readonly contentService;
    private contentByTypeAndId;
    constructor(contentService: ContentService);
    private unpackContent;
    getContentData(): IContent;
    getContentEntryByIdAndContentTypeOptional<K extends keyof IContent>(type: K, id: ContentEntry<K>['id']): ContentEntry<K> | undefined;
    getAllContentEntriesByContentType<K extends keyof IContent>(type: K): ContentEntry<K>[];
    getContentEntryByName<K extends keyof IContent>(type: K, name: ContentEntry<K>['name']): ContentEntry<K> | undefined;
    getAllContentCardsByPasscode(passcode: string): ContentEntry<'cards'>[];
}
export {};

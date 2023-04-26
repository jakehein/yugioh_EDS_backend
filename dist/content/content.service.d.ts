import { IContent } from './content.interface';
export declare class ContentService {
    private readonly content;
    constructor(content: IContent);
    get(): IContent;
}

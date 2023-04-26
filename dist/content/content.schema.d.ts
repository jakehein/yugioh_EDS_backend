import { ObjectId } from '@mikro-orm/mongodb';
import { IContent } from './content.interface';
export declare class ContentData {
    _id: ObjectId;
    content: IContent;
    constructor(content: IContent);
}

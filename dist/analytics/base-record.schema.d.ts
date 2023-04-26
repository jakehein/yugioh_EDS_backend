import { ObjectId } from '@mikro-orm/mongodb';
export declare class BaseRecord {
    _id: ObjectId;
    constructor(id: ObjectId);
}

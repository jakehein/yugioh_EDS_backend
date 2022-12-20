import { PrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export class BaseRecord {
  @PrimaryKey()
  _id: ObjectId;
  constructor(id: ObjectId) {
    this._id = id;
  }
}

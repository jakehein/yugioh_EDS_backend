import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { IContent } from './content.interface';

// TODO: double check this is necessary
@Entity()
export class ContentData {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  content: IContent;

  constructor(content: IContent) {
    this.content = content;
  }
}

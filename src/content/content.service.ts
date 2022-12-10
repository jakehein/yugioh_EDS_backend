// import { EntityRepository } from '@mikro-orm/core';
// import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_DATA } from './content-data.provider';
import { IContent } from './content.interface';
//import { ContentData } from './content.schema';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_DATA)
    private readonly content: IContent,
  ) {}
  get(): IContent {
    return this.content;
  }
}

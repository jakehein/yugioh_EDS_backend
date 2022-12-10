import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_DATA } from './content-data.provider';
import { IContent } from './content.interface';

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

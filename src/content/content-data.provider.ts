import { FactoryProvider } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { IContent } from './content.interface';

export const CONTENT_DATA = Symbol('CONTENT_DATA');

export const contentDataProvider: FactoryProvider<Promise<IContent>> = {
  provide: CONTENT_DATA,
  async useFactory() {
    const contentDataString = await readFile('public/content.json', {
      encoding: 'utf-8',
    });

    const contentData = JSON.parse(contentDataString) as IContent;

    return contentData;
  },
};

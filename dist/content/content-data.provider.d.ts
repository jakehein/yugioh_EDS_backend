import { FactoryProvider } from '@nestjs/common';
import { IContent } from './content.interface';
export declare const CONTENT_DATA: unique symbol;
export declare const contentDataProvider: FactoryProvider<Promise<IContent>>;

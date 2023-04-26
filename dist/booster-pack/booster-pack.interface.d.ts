import * as t from 'io-ts';
export interface IBoosterPack {
    id: string;
    name: string;
    unlockCondition?: string;
    imgLink?: string | URL;
    cardIds: string[];
}
export declare const boosterPackT: t.Type<IBoosterPack>;

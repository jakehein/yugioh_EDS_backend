import * as t from 'io-ts';
export interface EmailBrand {
    readonly Email: unique symbol;
}
export declare const email: t.BrandC<t.StringC, EmailBrand>;

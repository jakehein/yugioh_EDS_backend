import * as t from 'io-ts';

const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export interface EmailBrand {
  readonly Email: unique symbol;
}

export const email = t.brand(
  t.string,
  (s): s is t.Branded<string, EmailBrand> => emailRegex.test(s),
  'Email',
);

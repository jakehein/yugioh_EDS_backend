import { makePartial } from './helpers';

describe('makePartial', () => {
  let obj: { a: string; b: number };

  beforeEach(() => {
    obj = makePartial<{ a: string; b: number }>({
      a: 'hello',
    });
  });

  it('allows existing properties', () => {
    expect(obj.a).toBe('hello');
  });

  it('throws on nonexistent properties', () => {
    expect(() => {
      obj.b;
    }).toThrow();
  });
});

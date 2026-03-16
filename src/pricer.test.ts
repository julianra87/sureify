import { createPricer } from './pricer';

describe('createPricer', () => {
  it('provides the latest price given the options selected so far', () => {
    const pricer = createPricer();

    pricer('size', 'small');
    expect(pricer('creamer', 'none')).toBe(1);

    expect(pricer('creamer', 'dairy')).toBe(1.25);
    expect(pricer('creamer', 'non-dairy')).toBe(1.5);
    expect(pricer('size', 'large')).toBe(2.5);
  });
});

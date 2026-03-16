export type Category = 'size' | 'creamer';
export type Option = 'small' | 'medium' | 'large' | 'none' | 'dairy' | 'non-dairy';
export type Price = number;

export interface Pricer {
  /**
   * Invoked each time the user makes a selection.
   * No need to validate arguments, the caller validates the arguments before this function is invoked.
   * @returns the _total_ price of the coffee so far given all the selections made
   */
  (category: Category, option: Option): Price;
}

const SIZE_PRICES = { small: 1, medium: 1.5, large: 2 } as const;
const CREAMER_PRICES = { none: 0, dairy: 0.25, 'non-dairy': 0.5 } as const;

export const createPricer = (): Pricer => {
  let size: keyof typeof SIZE_PRICES = 'small';
  let creamer: keyof typeof CREAMER_PRICES = 'none';

  return (category: Category, option: Option): Price => {
    if (category === 'size') {
      size = option as keyof typeof SIZE_PRICES;
    } else {
      creamer = option as keyof typeof CREAMER_PRICES;
    }
    return SIZE_PRICES[size] + CREAMER_PRICES[creamer];
  };
};

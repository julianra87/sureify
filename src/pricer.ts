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

const SIZE_PRICE = { small: 1, medium: 1.5, large: 2 } as const;
const CREAMER_PRICE = { none: 0, dairy: 0.25, 'non-dairy': 0.5 } as const;

type SizeOption = keyof typeof SIZE_PRICE;
type CreamerOption = keyof typeof CREAMER_PRICE;

function isSizeOption(option: Option): option is SizeOption {
  return option === 'small' || option === 'medium' || option === 'large';
}

function isCreamerOption(option: Option): option is CreamerOption {
  return option === 'none' || option === 'dairy' || option === 'non-dairy';
}

export const createPricer = (): Pricer => {
  // Nothing selected yet: missing size or creamer counts as 0 for that line (caller order matches the UI).
  let size: SizeOption | undefined;
  let creamer: CreamerOption | undefined;

  return (category: Category, option: Option): Price => {
    if (category === 'size' && isSizeOption(option)) {
      size = option;
    } else if (category === 'creamer' && isCreamerOption(option)) {
      creamer = option;
    }

    const sizePart = size !== undefined ? SIZE_PRICE[size] : 0;
    const creamerPart = creamer !== undefined ? CREAMER_PRICE[creamer] : 0;
    return sizePart + creamerPart;
  };
};

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

/** Immutable pricing tables — frozen so they cannot be modified at runtime. */
const SIZE_PRICES = Object.freeze({ small: 1, medium: 1.5, large: 2 } as const);
const CREAMER_PRICES = Object.freeze({ none: 0, dairy: 0.25, 'non-dairy': 0.5 } as const);

type SizeOption = keyof typeof SIZE_PRICES;
type CreamerOption = keyof typeof CREAMER_PRICES;

/**
 * One immutable snapshot of size + creamer (output of replay, never updated in place).
 */
type SelectionState = Readonly<{
  size: SizeOption;
  creamer: CreamerOption;
}>;

/** One user selection, frozen — append-only log entries. */
type SelectionEvent = Readonly<{
  category: Category;
  option: Option;
}>;

function createSeedState(): SelectionState {
  return Object.freeze({
    size: 'small',
    creamer: 'none',
  });
}

function totalPrice(state: SelectionState): Price {
  return SIZE_PRICES[state.size] + CREAMER_PRICES[state.creamer];
}

/**
 * Next snapshot from a snapshot and one selection (does not mutate `current`).
 */
function applySelection(
  current: SelectionState,
  category: Category,
  option: Option
): SelectionState {
  if (category === 'size') {
    return Object.freeze({
      ...current,
      size: option as SizeOption,
    });
  }
  return Object.freeze({
    ...current,
    creamer: option as CreamerOption,
  });
}

/**
 * Current options are entirely determined by the ordered event log + seed.
 * No mutable “current state” — only replay.
 */
function stateAfterEvents(events: readonly SelectionEvent[], seed: SelectionState): SelectionState {
  return events.reduce(
    (state, { category, option }) => applySelection(state, category, option),
    seed
  );
}

export const createPricer = (): Pricer => {
  const seed = createSeedState();
  let events: readonly SelectionEvent[] = [];

  return (category: Category, option: Option): Price => {
    const event: SelectionEvent = Object.freeze({ category, option });
    events = Object.freeze([...events, event]) as readonly SelectionEvent[];
    const state = stateAfterEvents(events, seed);
    return totalPrice(state);
  };
};

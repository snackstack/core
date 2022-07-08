import { createContext } from 'react';
import { Snack, NewSnack } from './types';

type SnackContextType = {
  enqueueSnack(snack: NewSnack | string): Snack['id'] | null;
  closeSnack(id: Snack['id']): void;
  updateSnack(id: Snack['id'], properties: Omit<Partial<Snack>, 'id'>): void;
};

/** @internal */
export const SnackContext = createContext<SnackContextType>(null!);
SnackContext.displayName = 'SnackContext';

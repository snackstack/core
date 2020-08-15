import { createContext } from 'react';
import { MergedSnack, Snack } from '../types/snack';

type UpdateSnackProperties = Omit<Partial<Snack>, 'id'>;

export type SnackContextType = {
  enqueueSnack(snack: Snack): MergedSnack['id'] | null;
  closeSnack(id: MergedSnack['id']): void;
  updateSnack(id: MergedSnack['id'], properties: UpdateSnackProperties): void;
};

const defaultContext: SnackContextType = {
  enqueueSnack: () => {
    throw new Error('enqueueSnack is not implemented');
  },
  closeSnack: () => {
    throw new Error('closeSnack is not implemented');
  },
  updateSnack: () => {
    throw new Error('updateSnack is not implemented');
  },
};

export const SnackContext = createContext(defaultContext);

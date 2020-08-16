import { createContext } from 'react';
import { MergedSnack, Snack } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';

export type SnackContextType = {
  enqueueSnack(snack: Snack): MergedSnack['id'] | null;
  closeSnack(id: MergedSnack['id']): void;
  updateSnack(id: MergedSnack['id'], properties: Omit<Partial<Snack>, 'id'>): void;
  updateSnackOptions(properties: Partial<SnackProviderOptions>): void;
};

const defaultContextValue: SnackContextType = {
  enqueueSnack: () => {
    throw new Error('enqueueSnack is not implemented');
  },
  closeSnack: () => {
    throw new Error('closeSnack is not implemented');
  },
  updateSnack: () => {
    throw new Error('updateSnack is not implemented');
  },
  updateSnackOptions: () => {
    throw new Error('updateSnackOptions is not implemented');
  },
};

export const SnackContext = createContext(defaultContextValue);

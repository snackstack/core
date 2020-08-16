import { createContext } from 'react';
import { MergedSnack, Snack } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';

export type UpdateProviderOptionsArgs =
  | Partial<SnackProviderOptions>
  | ((options: SnackProviderOptions) => Partial<SnackProviderOptions>);

export type SnackContextType = {
  enqueueSnack(snack: Snack | string): MergedSnack['id'] | null;
  closeSnack(id: MergedSnack['id']): void;
  updateSnack(id: MergedSnack['id'], properties: Omit<Partial<Snack>, 'id'>): void;
  updateProviderOptions(properties: UpdateProviderOptionsArgs): void;
  removeSnack(id: MergedSnack['id']): void;
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
  updateProviderOptions: () => {
    throw new Error('updateSnackOptions is not implemented');
  },
  removeSnack: () => {
    throw new Error('removeSnack is not implemented');
  },
};

export const SnackContext = createContext(defaultContextValue);

if (process.env.NODE_ENV !== 'production') {
  SnackContext.displayName = 'SnackContext';
}

import { createContext } from 'react';
import { Snack, SnackPayload } from './types/Snack';
import { SnackProviderOptions } from './types/SnackProviderOptions';

export type UpdateProviderOptionsArgs =
  | Partial<SnackProviderOptions>
  | ((options: SnackProviderOptions) => Partial<SnackProviderOptions>);

export type SnackContextType = {
  enqueueSnack(snack: SnackPayload | string): Snack['id'] | null;
  closeSnack(id: Snack['id']): void;
  updateSnack(id: Snack['id'], properties: Omit<Partial<Snack>, 'id'>): void;
  updateProviderOptions(properties: UpdateProviderOptionsArgs): void;
  removeSnack(id: Snack['id']): void;
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

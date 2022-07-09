import { Snack, NewSnack, SnackManagerOptions } from './types';

/** @internal */
export function createSnack(payload: NewSnack, options: Required<SnackManagerOptions>): Snack {
  return {
    ...payload,
    id: payload.id ?? new Date().getTime() + Math.random(),
    message: payload.message,
    status: 'inactive',
    persist: payload.persist ?? options.persist,
    variant: payload.variant ?? 'default',
  };
}

/** @internal */
export function getDefaultOptions(options?: Partial<SnackManagerOptions>): Readonly<Required<SnackManagerOptions>> {
  return {
    maxSnacks: options?.maxSnacks ?? 3,
    persist: options?.persist ?? false,
    preventDuplicates: options?.preventDuplicates ?? false,
  };
}

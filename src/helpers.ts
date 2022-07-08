import { Snack, NewSnack, SnackProviderOptions } from './types';

/** @internal */
export function getSnack(payload: NewSnack, options: Required<SnackProviderOptions>): Snack {
  return {
    ...payload,
    id: payload.id ?? new Date().getTime() + Math.random(),
    message: payload.message,
    open: true,
    persist: payload.persist ?? options.persist,
    variant: payload.variant ?? 'default',
  };
}

/** @internal */
export function getDefaultOptions(options?: Partial<SnackProviderOptions>): Required<SnackProviderOptions> {
  return {
    maxSnacks: options?.maxSnacks ?? 3,
    persist: options?.persist ?? false,
    preventDuplicates: options?.preventDuplicates ?? false,
  };
}

import { defaultAutoHideDuration, defaultMaxSnacks, defaultSpacing, defaultTransitionDelay } from './constants';
import { Snack, NewSnack, SnackProviderOptions } from './types';

/** @internal */
export function getSnack(payload: NewSnack, options: Required<SnackProviderOptions>): Snack {
  return {
    id: payload.id ?? new Date().getTime() + Math.random(),
    open: true,
    message: payload.message,
    dynamicHeight: !!payload.dynamicHeight,
    persist: payload.persist ?? options.persist,
    action: payload.action,
    variant: payload.variant ?? 'default',
  };
}

/** @internal */
export function getDefaultOptions(options?: Partial<SnackProviderOptions>): Required<SnackProviderOptions> {
  return {
    maxSnacks: options?.maxSnacks ?? defaultMaxSnacks,
    persist: options?.persist ?? false,
    autoHideDuration: options?.autoHideDuration ?? defaultAutoHideDuration,
    preventDuplicates: options?.preventDuplicates ?? false,
    spacing: options?.spacing ?? defaultSpacing,
    transitionDelay: options?.transitionDelay ?? defaultTransitionDelay,
  };
}

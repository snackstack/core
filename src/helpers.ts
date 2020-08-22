import { defaultAutoHideDuration, defaultMaxSnacks, defaultSpacing, defaultTransitionDelay } from './constants';
import { Snack, SnackPayload } from './types/Snack';
import { SnackProviderOptions } from './types/SnackProviderOptions';

export function getSnack(payload: SnackPayload, options: SnackProviderOptions): Snack {
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

export function getDefaultOptions(options?: Partial<SnackProviderOptions>): SnackProviderOptions {
  return {
    maxSnacks: options?.maxSnacks ?? defaultMaxSnacks,
    persist: options?.persist ?? false,
    autoHideDuration: options?.autoHideDuration ?? defaultAutoHideDuration,
    preventDuplicates: options?.preventDuplicates ?? false,
    spacing: options?.spacing ?? defaultSpacing,
    transitionDelay: options?.transitionDelay ?? defaultTransitionDelay,
  };
}

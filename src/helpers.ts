import { defaultAutoHideDuration, defaultMaxSnacks, defaultSpacing, defaultTransitionDelay } from './constants';
import { SnackProviderOptions } from './types/SnackProviderOptions';

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

import { useMemo } from 'react';
import {
  defaultAnchorOrigin,
  defaultAutoHideDuration,
  defaultMaxSnacks,
  defaultSpacing,
  DefaultTransitionComponent,
} from '../constants';
import { InternalSnackProviderOptions, SnackProviderOptions } from '../types/snackProviderOptions';

export function useOptions(options?: SnackProviderOptions) {
  return useMemo<InternalSnackProviderOptions>(
    () => ({
      maxSnacks: options?.maxSnacks ?? defaultMaxSnacks,
      persist: options?.persist ?? false,
      autoHideDuration: options?.autoHideDuration ?? defaultAutoHideDuration,
      preventDuplicates: options?.preventDuplicates ?? false,
      spacing: options?.spacing ?? defaultSpacing,
      anchorOrigin: options?.anchorOrigin ?? defaultAnchorOrigin,
      TransitionComponent: options?.TransitionComponent ?? DefaultTransitionComponent,
      TransitionProps: options?.TransitionProps,
      action: options?.action,
    }),
    [options]
  );
}

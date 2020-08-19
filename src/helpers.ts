import { defaultAutoHideDuration, defaultMaxSnacks, defaultSpacing, startOffset } from './constants';
import { KeyedSnacks } from './SnackManager';
import { Snack } from './types/Snack';
import { SnackProviderOptions } from './types/SnackProviderOptions';

export function getOffset(index: number, ids: Snack['id'][], items: KeyedSnacks, spacing: number) {
  let offset = startOffset;

  if (index === 0) return offset;

  for (let i = 0; i < index; i++) {
    const snackId = ids[i];
    const snack = items[snackId];

    if (!snack) {
      console.warn(`Active Snack with id '${snackId}' could not be found`);

      continue;
    }

    offset += snack.height + spacing;
  }

  return offset;
}

export function getDefaultOptions(options?: Partial<SnackProviderOptions>): SnackProviderOptions {
  return {
    maxSnacks: options?.maxSnacks ?? defaultMaxSnacks,
    persist: options?.persist ?? false,
    autoHideDuration: options?.autoHideDuration ?? defaultAutoHideDuration,
    preventDuplicates: options?.preventDuplicates ?? false,
    spacing: options?.spacing ?? defaultSpacing,
    hideIcon: options?.hideIcon ?? false,
  };
}

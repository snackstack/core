import {
  defaultAnchorOrigin,
  defaultAutoHideDuration,
  defaultMaxSnacks,
  defaultSpacing,
  DefaultTransitionComponent,
  startOffset,
} from './constants';
import { KeyedSnacks } from './SnackManager';
import { MergedSnack, SnackId } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';

type OffsetMap = { [anchor: string]: number };

function getOffsetMapString(anchorOrigin: SnackProviderOptions['anchorOrigin']) {
  return anchorOrigin.horizontal + anchorOrigin.vertical;
}

export function getOffset(index: number, item: MergedSnack, ids: SnackId[], items: KeyedSnacks, spacing: number) {
  const offsetMap: OffsetMap = {};

  if (index === 0) return startOffset;

  for (let i = 0; i < index; i++) {
    const snackId = ids[i];
    const snack = items[snackId];

    if (!snack) {
      console.warn(`Active Snack with id '${snackId}' could not be found`);

      continue;
    }

    const anchorString = getOffsetMapString(snack.anchorOrigin);

    if (!offsetMap[anchorString]) offsetMap[anchorString] = startOffset;

    offsetMap[anchorString] += snack.height + spacing;
  }

  return offsetMap[getOffsetMapString(item.anchorOrigin)];
}

export function getDefaultOptions(options?: Partial<SnackProviderOptions>): SnackProviderOptions {
  return {
    maxSnacks: options?.maxSnacks ?? defaultMaxSnacks,
    persist: options?.persist ?? false,
    autoHideDuration: options?.autoHideDuration ?? defaultAutoHideDuration,
    preventDuplicates: options?.preventDuplicates ?? false,
    spacing: options?.spacing ?? defaultSpacing,
    anchorOrigin: options?.anchorOrigin ?? defaultAnchorOrigin,
    TransitionComponent: options?.TransitionComponent ?? DefaultTransitionComponent,
  };
}

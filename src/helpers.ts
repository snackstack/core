import { SlideProps, SnackbarOrigin } from '@material-ui/core';
import { KeyedItems } from './hooks/useStore';
import { MergedSnack, SnackId } from './types/snack';

const TransitionDirectionMap: { [key: string]: SlideProps['direction'] } = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left',
};

export function getTransitionDirection(anchorOrigin: SnackbarOrigin) {
  if (anchorOrigin.horizontal !== 'center') {
    return TransitionDirectionMap[anchorOrigin.horizontal];
  }

  return TransitionDirectionMap[anchorOrigin.vertical];
}

export function getOffset(index: number, ids: SnackId[], items: KeyedItems<SnackId, MergedSnack>, spacing: number) {
  // todo: this start-bound should be configurable
  let offset = 20;

  if (index === 0) return offset;

  for (let i = 0; i < index; i++) {
    if (i === index) break;

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

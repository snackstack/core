import { SlideProps, SnackbarOrigin } from '@material-ui/core';

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

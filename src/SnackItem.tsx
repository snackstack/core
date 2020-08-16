import React, { FC, memo } from 'react';
import { Snackbar, SnackbarContent, SnackbarProps } from '@material-ui/core';
import { usePrevious } from './hooks/usePrevious';
import { useHeightObserver } from './hooks/useHeightObserver';
import { MergedSnack } from './types/snack';
import { defaultTransitionDelay } from './constants';

interface ComponentProps extends Pick<SnackbarProps, 'TransitionComponent' | 'TransitionProps'> {
  index: number;
  anchorOrigin: Exclude<SnackbarProps['anchorOrigin'], undefined>;
  snack: MergedSnack;
  offset: number;
  enableAutoHide: boolean;
  onSetHeight(height: number): void;
  onClose(): void;
  onExited(): void;
}

// todo: this re-renders too often
export const SnackItem: FC<ComponentProps> = memo(({ index, snack, ...props }) => {
  const setSnackRef = useHeightObserver(snack.dynamicHeight, props.onSetHeight);
  const previousOffset = usePrevious(props.offset);

  if (!snack) return null;

  let action = snack.action;
  if (typeof action === 'function') {
    // todo: action property callback is not correctly resolved by editor
    //       maybe due to a ciruclar reference, but there are no errors
    // todo: we need to created a filtered ExposedSnack item here from 'snack'
    //       as to not leak implementation details to the user

    action = action(snack, props.onClose);
  }

  const style: React.CSSProperties = {
    [props.anchorOrigin.vertical]: props.offset,
  };

  if (props.offset <= previousOffset) {
    // todo: this should be configurable
    const transitionDelay = defaultTransitionDelay;

    style.MozTransition = `all ${transitionDelay}ms`;
    style.msTransition = `all ${transitionDelay}ms`;
    style.transition = `all ${transitionDelay}ms`;
  }

  const handleClose: SnackbarProps['onClose'] = (_, reason) => {
    if (reason === 'clickaway') return;

    props.onClose();
  };

  return (
    <Snackbar
      ref={ref => setSnackRef(ref as HTMLElement)}
      key={snack.id}
      open={snack.open}
      anchorOrigin={props.anchorOrigin}
      style={style}
      autoHideDuration={props.enableAutoHide ? snack.autoHideDuration : undefined}
      onClose={handleClose}
      onExited={props.onExited}
      TransitionComponent={props.TransitionComponent}
      TransitionProps={props.TransitionProps}
    >
      <SnackbarContent message={snack.message} action={action} />
    </Snackbar>
  );
});

import React, { FC, memo, useMemo } from 'react';
import { Snackbar, SnackbarContent, SnackbarProps } from '@material-ui/core';
import { usePrevious, useHeightObserver } from './hooks';
import { MergedSnack } from './types/snack';
import { defaultTransitionDelay } from './constants';
import { SnackProviderOptions } from './types/snackProviderOptions';

interface ComponentProps extends Pick<SnackProviderOptions, 'autoHideDuration' | 'TransitionComponent'> {
  index: number;
  snack: MergedSnack;
  offset: number;
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
    [snack.anchorOrigin.vertical]: props.offset,
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

  const TransitionComponent = useMemo(() => props.TransitionComponent(snack.anchorOrigin), [snack.anchorOrigin]);

  return (
    <Snackbar
      ref={ref => setSnackRef(ref as HTMLElement)}
      key={snack.id}
      open={snack.open}
      anchorOrigin={snack.anchorOrigin}
      style={style}
      autoHideDuration={props.autoHideDuration}
      onClose={handleClose}
      onExited={props.onExited}
      TransitionComponent={TransitionComponent}
    >
      <SnackbarContent message={snack.message} action={action} />
    </Snackbar>
  );
});

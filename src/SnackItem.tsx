import React, { FC, memo } from 'react';
import { Snackbar, SnackbarContent, SnackbarProps } from '@material-ui/core';
import { usePrevious } from './hooks/usePrevious';
import { useHeightObserver } from './hooks/useHeightObserver';
import { CloseReason } from './types/closeReason';
import { MergedSnack } from './types/snack';

interface ComponentProps extends Pick<SnackbarProps, 'TransitionComponent' | 'TransitionProps'> {
  index: number;
  anchorOrigin: Exclude<SnackbarProps['anchorOrigin'], undefined>;
  snack: MergedSnack;
  offset: number;
  enableAutoHide: boolean;
  onSetHeight(height: number): void;
  onClose(reason: CloseReason): void;
  onExited(): void;
}

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

    action = action(snack, () => props.onClose('manually'));
  }

  const style: React.CSSProperties = {
    [props.anchorOrigin.vertical]: props.offset,
  };

  if (props.offset <= previousOffset) {
    // todo: this should be configurable
    const transitionDelay = 500;

    style.MozTransition = `all ${transitionDelay}ms`;
    style.msTransition = `all ${transitionDelay}ms`;
    style.transition = `all ${transitionDelay}ms`;
  }

  return (
    <Snackbar
      ref={ref => setSnackRef(ref as HTMLElement)}
      key={snack.id}
      open={snack.open}
      anchorOrigin={props.anchorOrigin}
      style={style}
      autoHideDuration={props.enableAutoHide ? snack.autoHideDuration : undefined}
      onClose={(_, reason) => props.onClose(reason)}
      onExited={props.onExited}
      TransitionComponent={props.TransitionComponent}
      TransitionProps={props.TransitionProps}
    >
      <SnackbarContent message={snack.message} action={action} />
    </Snackbar>
  );
});

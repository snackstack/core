import React, { FC, memo, useMemo } from 'react';
import { Snackbar, SnackbarContent, SnackbarProps } from '@material-ui/core';
import { useHeightObserver, usePrevious } from './hooks';
import { MergedSnack } from './types/snack';
import { defaultTransitionDelay } from './constants';
import { SnackProviderOptions } from './types/snackProviderOptions';

interface ComponentProps extends Pick<SnackProviderOptions, 'autoHideDuration' | 'TransitionComponent'> {
  index: number;
  snack: MergedSnack;
  offset: number;
  onSetHeight(id: MergedSnack['id'], height: number): void;
  onClose(id: MergedSnack['id']): void;
  onExited(id: MergedSnack['id']): void;
}

export const SnackItem: FC<ComponentProps> = memo(({ index, snack, ...props }) => {
  const ref = useHeightObserver(snack.dynamicHeight, height => props.onSetHeight(snack.id, height));
  const previousOffset = usePrevious(props.offset);

  if (!snack) return null;

  let action = snack.action;
  if (typeof action === 'function') {
    // todo: action property callback is not correctly resolved by editor
    //       maybe due to a ciruclar reference, but there are no errors
    // todo: we need to created a filtered ExposedSnack item here from 'snack'
    //       as to not leak implementation details to the user

    action = action(snack, () => props.onClose(snack.id));
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

    props.onClose(snack.id);
  };

  const TransitionComponent = useMemo(() => props.TransitionComponent(snack.anchorOrigin), [snack.anchorOrigin]);

  return (
    <Snackbar
      ref={ref}
      key={snack.id}
      open={snack.open}
      anchorOrigin={snack.anchorOrigin}
      style={style}
      autoHideDuration={props.autoHideDuration}
      onClose={handleClose}
      onExited={() => props.onExited(snack.id)}
      TransitionComponent={TransitionComponent}
    >
      <SnackbarContent message={snack.message} action={action} />
    </Snackbar>
  );
});

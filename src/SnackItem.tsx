import React, { FC, isValidElement, memo, useMemo } from 'react';
import { createStyles, makeStyles, Snackbar, SnackbarContent, SnackbarProps } from '@material-ui/core';
import { useHeightObserver, usePrevious } from './hooks';
import { defaultTransitionDelay, VariantIcons } from './constants';
import { SnackProviderOptions } from './types/snackProviderOptions';
import { Snack } from './types/snack';
import { amber, blue, green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme =>
  createStyles({
    message: {
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    },
    icon: {
      color: '#fff',
      fontSize: 24,
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    iconAction: {
      fontSize: 20,
    },
    error: {
      backgroundColor: red[600],
    },
    warning: {
      backgroundColor: amber[800],
    },
    info: {
      backgroundColor: blue[500],
    },
    success: {
      backgroundColor: green[500],
    },
  })
);

interface ComponentProps extends Pick<SnackProviderOptions, 'autoHideDuration' | 'TransitionComponent' | 'hideIcon'> {
  index: number;
  snack: Snack;
  offset: number;
  onSetHeight(id: Snack['id'], height: number): void;
  onClose(id: Snack['id']): void;
  onExited(id: Snack['id']): void;
}

export const SnackItem: FC<ComponentProps> = memo(({ index, snack, ...props }) => {
  const ref = useHeightObserver(snack.dynamicHeight, height => props.onSetHeight(snack.id, height));
  const previousOffset = usePrevious(props.offset);

  const styles = useStyles();

  if (!snack) return null;

  let action = snack.action;
  if (typeof action === 'function') {
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

  const Icon = VariantIcons[snack.variant];

  const content = isValidElement(snack.message) ? snack.message : null;

  return (
    /* @ts-ignore */
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
      {/* @ts-ignore */}
      {content || (
        <SnackbarContent
          className={styles[snack.variant as keyof typeof useStyles]}
          message={
            <div className={styles['message']}>
              {!props.hideIcon && Icon && <Icon className={styles.icon} />}
              {snack.message}
            </div>
          }
          action={action}
        />
      )}
    </Snackbar>
  );
});

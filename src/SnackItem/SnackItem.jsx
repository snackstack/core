import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import RootRef from '@material-ui/core/RootRef';
import { snackItemVariantIcons, snackItemStyles } from './SnackItemStyles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getTransitionDirection, getTransitionDelay } from '../helpers';

const SnackItem = props => {
  const {
    classes,
    offset,
    onClose,
    onEnter,
    onExited,
    onSetSnackHeight,
    options: {
      TransitionComponent,
      TransitionProps,
      anchorOrigin,
      autoHideDuration,
    },
    snack: {
      action: snackAction,
      content: snackContent,
      key,
      message,
      open,
      persist,
      variant = 'info',
    },
  } = props;

  const Icon = snackItemVariantIcons[variant];
  const ref = useRef();

  useEffect(() => {
    if (ref.current === undefined) return;

    onSetSnackHeight(key, ref.current.clientHeight);
  }, [key, onSetSnackHeight]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;

    onClose(key, reason);
  };

  const handleEnter = () => {
    onEnter(key);
  };

  const handleExited = () => {
    onExited(key);
  };

  let content = snackContent;
  if (content !== undefined && typeof content === 'function')
    content = content({ key, closeSnack: () => onClose(key), classes });

  let action = snackAction;
  if (action !== undefined && typeof action === 'function')
    action = action({ key, closeSnack: () => onClose(key), classes });

  const transitionDelay = getTransitionDelay(TransitionProps);

  return (
    <RootRef rootRef={ref}>
      <Snackbar
        anchorOrigin={anchorOrigin}
        autoHideDuration={persist ? undefined : autoHideDuration}
        open={open}
        style={{
          [anchorOrigin.vertical]: offset,
          MozTransition: `all ${transitionDelay}ms`,
          msTransition: `all ${transitionDelay}ms`,
          OTransition: `all ${transitionDelay}ms`,
          transition: `all ${transitionDelay}ms`,
          WebKitTransition: `all ${transitionDelay}ms`,
        }}
        TransitionComponent={TransitionComponent}
        TransitionProps={{
          ...TransitionProps,
          direction: getTransitionDirection(anchorOrigin),
        }}
        onClose={handleClose}
        onEnter={handleEnter}
        onExited={handleExited}
      >
        {content || (
          <SnackbarContent
            action={action}
            aria-describedby="client-snackbar"
            className={classes[variant]}
            message={
              <span className={classes.message} id="client-snackbar">
                <Icon
                  className={classNames(classes.icon, classes.iconVariant)}
                />
                {message}
              </span>
            }
          />
        )}
      </Snackbar>
    </RootRef>
  );
};

SnackItem.propTypes = {
  classes: PropTypes.object,
  snack: PropTypes.shape({
    action: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    open: PropTypes.bool.isRequired,
    persist: PropTypes.bool.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    anchorOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    }),
    autoHideDuration: PropTypes.number,
    TransitionComponent: PropTypes.elementType,
    TransitionProps: PropTypes.object,
  }).isRequired,
  offset: PropTypes.number.isRequired,
  onEnter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  onSetSnackHeight: PropTypes.func.isRequired,
};

export default withStyles(snackItemStyles)(SnackItem);

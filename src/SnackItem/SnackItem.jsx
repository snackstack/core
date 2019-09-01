import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { snackItemVariantIcons, snackItemStyles } from './SnackItemStyles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getTransitionDirection, getTransitionDelay } from '../helpers';

const SnackItem = props => {
  const {
    TransitionProps,
    anchorOrigin,
    autoHideDuration,
    classes,
    closeSnack,
    hideIcon,
    offset,
    onChangeHeight,
    onClose,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    snack: {
      action: snackAction,
      content: snackContent,
      key,
      message,
      open,
      persist,
      variant = 'info',
    },
    ...otherProps
  } = props;

  const Icon = snackItemVariantIcons[variant];
  const ref = useRef();

  useEffect(() => {
    if (ref.current === undefined) return;

    onChangeHeight(key, ref.current.clientHeight);
  }, [key, onChangeHeight]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    onClose(event, reason, key);
  };

  const handleEnter = () => onEnter(key);

  const handleEntered = () => onEntered(key);

  const handleEntering = () => onEntering(key);

  const handleExit = () => onExit(key);

  const handleExited = () => onExited(key);

  const handleExiting = () => onExiting(key);

  let content = snackContent;
  if (content !== undefined && typeof content === 'function')
    content = content({ key, closeSnack: () => closeSnack(key), classes });

  let action = snackAction;
  if (action !== undefined && typeof action === 'function')
    action = action({ key, closeSnack: () => closeSnack(key), classes });

  const transitionDelay = getTransitionDelay(TransitionProps);

  return (
    <Snackbar
      {...otherProps}
      anchorOrigin={anchorOrigin}
      autoHideDuration={persist ? undefined : autoHideDuration}
      open={open}
      ref={ref}
      style={{
        [anchorOrigin.vertical]: offset,
        MozTransition: `all ${transitionDelay}ms`,
        msTransition: `all ${transitionDelay}ms`,
        OTransition: `all ${transitionDelay}ms`,
        transition: `all ${transitionDelay}ms`,
        WebKitTransition: `all ${transitionDelay}ms`,
      }}
      TransitionProps={{
        ...TransitionProps,
        direction: getTransitionDirection(anchorOrigin),
      }}
      onClose={handleClose}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
    >
      {content || (
        <SnackbarContent
          action={action}
          aria-describedby="client-snackbar"
          className={classes[variant]}
          message={
            <span className={classes.message} id="client-snackbar">
              {!hideIcon && (
                <Icon
                  className={classNames(classes.icon, classes.iconVariant)}
                />
              )}
              {message}
            </span>
          }
        />
      )}
    </Snackbar>
  );
};

SnackItem.propTypes = {
  classes: PropTypes.object,
  closeSnack: PropTypes.func.isRequired,
  snack: PropTypes.shape({
    action: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    open: PropTypes.bool.isRequired,
    persist: PropTypes.bool,
  }).isRequired,
  hideIcon: PropTypes.bool,
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
  }),
  autoHideDuration: PropTypes.number,
  TransitionComponent: PropTypes.elementType,
  TransitionProps: PropTypes.object,
  offset: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onEntered: PropTypes.func.isRequired,
  onEntering: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  onExiting: PropTypes.func.isRequired,
  onChangeHeight: PropTypes.func.isRequired,
};

export default withStyles(snackItemStyles)(SnackItem);

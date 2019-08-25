import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import RootRef from '@material-ui/core/RootRef';
import { snackItemVariantIcons, useSnackItemStyles } from './SnackItemStyles';
import PropTypes from 'prop-types';

const SnackItem = props => {
  const {
    offset,
    onClose,
    onEnter,
    onExited,
    onSetSnackHeight,
    options: { anchorOrigin, autoHideDuration },
    snack: {
      action: snackActioon,
      key,
      message,
      open,
      persist,
      variant = 'info',
    },
  } = props;
  const classes = useSnackItemStyles();
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

  let action = snackActioon;
  if (action !== undefined && typeof action === 'function')
    action = action({ key, closeSnack: () => onClose(key), classes });

  return (
    <RootRef rootRef={ref}>
      <Snackbar
        anchorOrigin={anchorOrigin}
        autoHideDuration={persist ? undefined : autoHideDuration}
        open={open}
        style={{
          [anchorOrigin.vertical]: offset,
        }}
        onClose={handleClose}
        onEnter={handleEnter}
        onExited={handleExited}
      >
        <SnackbarContent
          action={action}
          aria-describedby="client-snackbar"
          className={classes[variant]}
          message={
            <span className={classes.message} id="client-snackbar">
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
        />
      </Snackbar>
    </RootRef>
  );
};

SnackItem.propTypes = {
  snack: PropTypes.shape({
    action: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
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
  }).isRequired,
  offset: PropTypes.number.isRequired,
  onEnter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  onSetSnackHeight: PropTypes.func.isRequired,
};

export default SnackItem;

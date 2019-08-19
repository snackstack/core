import React from 'react';
import classNames from 'classnames';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { snackItemVariantIcons, useSnackItemStyles } from './SnackItemStyles';

const SnackItem = (props) => {
  const {
    snack: { key, message, variant = 'info', open },
    options: { autoHideDuration },
    onClose,
    onExited,
  } = props;
  const classes = useSnackItemStyles();
  const Icon = snackItemVariantIcons[variant];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    onClose(key, event, reason);
  };

  const handleExited = (event) => {
    onExited(key, event);
  };

  return (
    <Snackbar
      autoHideDuration={autoHideDuration}
      open={open}
      onClose={handleClose}
      onExited={handleExited}
    >
      <SnackbarContent
        className={classes[variant]}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
      />
    </Snackbar>
  );
};

export default SnackItem;

import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import RootRef from '@material-ui/core/RootRef';
import { snackItemVariantIcons, useSnackItemStyles } from './SnackItemStyles';

const SnackItem = (props) => {
  const {
    snack: {
      key, message, variant = 'info', open,
    },
    options: { autoHideDuration },
    offset,
    onClose,
    onExited,
  } = props;
  const classes = useSnackItemStyles();
  const Icon = snackItemVariantIcons[variant];
  const ref = useRef();

  useEffect(() => {
    if (ref.current === undefined) return;

    props.onSetSnackHeight(key, ref.current.clientHeight);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    onClose(key, event, reason);
  };

  const handleExited = (event) => {
    onExited(key, event);
  };

  return (
    <RootRef rootRef={ref}>
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        TransitionProps={{
          direction: 'right',
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleClose}
        onExited={handleExited}
        style={{
          bottom: offset,
        }}
      >
        <SnackbarContent
          className={classes[variant]}
          aria-describedby="client-snackbar"
          message={(
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
)}
        />
      </Snackbar>
    </RootRef>
  );
};

export default SnackItem;

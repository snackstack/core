import React from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const SnackItem = (props) => {
  const {
    snack, options, onClose, onExited,
  } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    onClose(snack.key, event, reason);
  };

  const handleExited = (event) => {
    onExited(snack.key, event);
  };

  const { autoHideDuration } = options;

  return (
    <Snackbar
      autoHideDuration={autoHideDuration}
      open={snack.open}
      onClose={handleClose}
      onExited={handleExited}
    >
      <SnackbarContent
        aria-describedby="client-snackbar"
        message={<span id="client-snackbar">{snack.message}</span>}
      />
    </Snackbar>
  );
};

export default SnackItem;

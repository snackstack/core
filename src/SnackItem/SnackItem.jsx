import React from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const SnackItem = (props) => {
  const {
    snack, options, onClose, onExited,
  } = props;

  const handleClose = (event, reason) => {
    onClose(snack.key, event, reason);
  };

  const handleExited = (event) => {
    onExited(snack.key, event);
  };

  return (
    <Snackbar
      {...options}
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

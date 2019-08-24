import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, amber, red } from '@material-ui/core/colors';

const ErrorIcon = props => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </SvgIcon>
);

const WarningIcon = props => (
  <SvgIcon {...props}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </SvgIcon>
);

const InfoIcon = props => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </SvgIcon>
);

const SuccessIcon = props => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </SvgIcon>
);

export const snackItemVariantIcons = {
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  success: SuccessIcon,
};

export const useSnackItemStyles = makeStyles(theme => ({
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
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
  },
}));

import { green, blue, amber, red } from '@material-ui/core/colors';
import { ErrorIcon, WarningIcon, InfoIcon, SuccessIcon } from './../constants';

export const snackbarClasses = {
  root: {},
  anchorOriginTopCenter: {},
  anchorOriginBottomCenter: {},
  anchorOriginTopRight: {},
  anchorOriginBottomRight: {},
  anchorOriginTopLeft: {},
  anchorOriginBottomLeft: {},
};

export const snackItemVariantIcons = {
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  success: SuccessIcon,
};

export const snackItemStyles = theme => ({
  ...snackbarClasses,
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
    color: '#fff',
  },
  iconVariant: {
    fontSize: 24,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  iconAction: {
    fontSize: 20,
  },
  message: {
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
  },
});

export const getSnackbarClasses = classes =>
  Object.keys(classes)
    .filter(key => snackbarClasses[key] !== undefined)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: classes[key],
      }),
      {},
    );

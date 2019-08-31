import { green, blue, amber, red } from '@material-ui/core/colors';
import { ErrorIcon, WarningIcon, InfoIcon, SuccessIcon } from './../constants';

export const snackItemVariantIcons = {
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  success: SuccessIcon,
};

export const snackItemStyles = theme => ({
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
    color: '#fff',
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
});

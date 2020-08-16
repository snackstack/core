import { SnackbarOrigin, SnackbarProps } from '@material-ui/core';
import { Snack } from './snack';

export type SnackProviderOptions = Pick<SnackbarProps, 'anchorOrigin' | 'TransitionProps'> &
  Pick<Snack, 'action' | 'autoHideDuration' | 'persist'> & {
    maxSnacks?: number;
    spacing?: number;
    preventDuplicates?: boolean;
    TransitionComponent?(anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'];
  };

export type InternalSnackProviderOptions = Required<Omit<SnackProviderOptions, 'action' | 'TransitionProps'>> &
  Pick<SnackProviderOptions, 'action' | 'TransitionProps'>;

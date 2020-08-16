import { SnackbarOrigin, SnackbarProps } from '@material-ui/core';
import { Snack } from './snack';

type RequiredSnackbarProps = Required<Pick<SnackbarProps, 'anchorOrigin'>>;
type RequiredSnackProps = Required<Pick<Snack, 'autoHideDuration' | 'persist'>>;

export type SnackProviderOptions = RequiredSnackbarProps &
  RequiredSnackProps & {
    maxSnacks: number;
    spacing: number;
    preventDuplicates: boolean;
    TransitionComponent(anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'];
  };

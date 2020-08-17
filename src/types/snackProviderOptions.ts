import { SnackbarOrigin, SnackbarProps } from '@material-ui/core';

export type SnackProviderOptions = Required<Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'>> & {
  maxSnacks: number;
  persist: boolean;
  spacing: number;
  preventDuplicates: boolean;
  TransitionComponent(anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'];
  hideIcon: boolean;
};

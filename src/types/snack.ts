import { SnackbarContentProps, SnackbarProps } from '@material-ui/core';
import { SnackProviderOptions } from './snackProviderOptions';

type SnackActionCallback = (snack: ExposedSnack, close: () => void) => SnackbarProps['action'];

// todo: this should support custom content that is rendered instead of the SnackbarContent
export interface Snack extends Partial<Pick<SnackProviderOptions, 'anchorOrigin'>> {
  id?: string | number;
  persist?: boolean;
  autoHideDuration?: SnackbarProps['autoHideDuration'];
  dynamicHeight?: boolean;
  message?: SnackbarContentProps['message'];
  action?: SnackbarProps['action'] | SnackActionCallback;
}

export type SnackId = Exclude<Snack['id'], undefined>;

export interface MergedSnack
  extends Pick<Snack, 'action' | 'message'>,
    Pick<SnackProviderOptions, 'persist' | 'anchorOrigin'> {
  readonly id: SnackId;
  open: boolean;
  height: number;
  dynamicHeight: Exclude<Snack['dynamicHeight'], undefined>;
}

export type ExposedSnack = Omit<MergedSnack, 'open' | 'height'>;

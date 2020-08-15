import { SnackbarContentProps, SnackbarProps } from '@material-ui/core';

type SnackActionCallback = (snack: ExposedSnack, close: () => void) => SnackbarProps['action'];

// todo: this should support custom content that is rendered instead of the SnackbarContent
export interface Snack {
  id?: string | number;
  persist?: boolean;
  autoHideDuration?: SnackbarProps['autoHideDuration'];
  dynamicHeight?: boolean;
  message?: SnackbarContentProps['message'];
  action?: SnackbarProps['action'] | SnackActionCallback;
}

export type SnackId = Exclude<Snack['id'], undefined>;

export interface MergedSnack {
  readonly id: SnackId;
  open: boolean;
  height: number;
  dynamicHeight: Exclude<Snack['dynamicHeight'], undefined>;
  autoHideDuration: Snack['autoHideDuration'];
  message: Snack['message'];
  action: Snack['message'];
}

export type ExposedSnack = Omit<MergedSnack, 'open' | 'height'>;

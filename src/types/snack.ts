import { SnackbarContentProps, SnackbarProps } from '@material-ui/core';
import { SnackProviderOptions } from './snackProviderOptions';

type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

type SnackAction = Exclude<SnackbarProps['action'], undefined>;

export interface Snack extends Pick<SnackProviderOptions, 'anchorOrigin' | 'persist'> {
  readonly id: string | number;
  dynamicHeight: boolean;
  message: SnackbarContentProps['message'];
  action?: SnackAction | ((snack: this, close: () => void) => SnackAction);
  variant: SnackVariant;
  open: boolean;
  height: number;
}

export type SnackPayload = Partial<Omit<Snack, 'id' | 'height' | 'open'>> & {
  id?: Snack['id'];
};

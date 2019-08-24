import { ComponentType, ReactNode, ComponentClass } from 'react';
import { SnackbarProps, SnackbarOrigin } from '@material-ui/core/Snackbar';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type SnackVariantType = 'error' | 'warning' | 'info' | 'success';

export interface Snack {
  key?: string | number;
  variant?: SnackVariantType;
  message: string | ReactNode;
}

export interface SnackOptions {
  maxSnacks?: number;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  preventDuplicates?: boolean;
}

export interface SnackProviderProps {
  options?: SnackOptions;
  onExited?: SnackbarProps['onExited'];
  onClose?: SnackbarProps['onClose'];
}

export const SnackProvider: ComponentType<SnackProviderProps>;

export type EnqueueSnackFuncType = (snack: Snack) => Snack['key'];
export type CloseSnackFuncType = (key: Snack['key']) => void;

export interface WithSnacksProps {
  enqueueSnack: EnqueueSnackFuncType;
  closeSnack: CloseSnackFuncType;
}

export function withSnacks<T extends WithSnacksProps>(
  component: ComponentType<T>,
): ComponentClass<Omit<T, keyof WithSnacksProps>>;

export function useSnacks(): [EnqueueSnackFuncType, CloseSnackFuncType];

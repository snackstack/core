import {
  ComponentType,
  ReactNode,
  ComponentClass,
  SyntheticEvent,
} from 'react';
import { SnackbarProps } from '@material-ui/core/Snackbar';
import { ClassNameMap } from '@material-ui/styles/withStyles';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type SnackItemClassKey =
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'icon'
  | 'iconVariant'
  | 'iconAction'
  | 'message';

type SnackVariantType = 'error' | 'warning' | 'info' | 'success';

type SnackCloseReason = 'timeout' | 'clickaway' | 'manually' | 'newsnack';

type FilteredSnackbarProps = Omit<
  SnackbarProps,
  | 'open'
  | 'message'
  | 'classes'
  | 'ref'
  | 'innerRef'
  | 'onClose'
  | 'onEnter'
  | 'onEntered'
  | 'onEntering'
  | 'onExit'
  | 'onExited'
  | 'onExiting'
  | keyof React.HTMLAttributes<HTMLDivElement>
>;

export interface SnackNodeArgs {
  key: Snack['key'];
  classes: ClassNameMap<SnackItemClassKey>;
  closeSnack: () => void;
}

export interface Snack {
  key?: string | number;
  variant?: SnackVariantType;
  message: string | ReactNode;
  persist?: boolean;
  content?: ReactNode | ((args: SnackNodeArgs) => ReactNode);
  action?: ReactNode | ((args: SnackNodeArgs) => ReactNode);
}

export interface SnackProviderProps extends FilteredSnackbarProps {
  classes?: Partial<ClassNameMap<SnackItemClassKey>>;
  iconVariants?: Partial<Record<SnackVariantType, ReactNode>>;
  spacing?: number;
  hideIcon?: boolean;
  maxSnacks?: number;
  preventDuplicates?: boolean;
  action?: Snack['action'];
  onClose?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: SyntheticEvent<any>,
    reason: SnackCloseReason,
    key: Snack['key'],
  ) => void;
  onEnter?: (key: Snack['key']) => void;
  onEntered?: (key: Snack['key']) => void;
  onEntering?: (key: Snack['key']) => void;
  onExit?: (key: Snack['key']) => void;
  onExited?: (key: Snack['key']) => void;
  onExiting?: (key: Snack['key']) => void;
}

export const SnackProvider: ComponentType<SnackProviderProps>;

export type EnqueueSnackFunc = (snack: Snack) => Snack['key'] | null;
export type CloseSnackFunc = (key: Snack['key']) => void;

export interface WithSnacksProps {
  enqueueSnack: EnqueueSnackFunc;
  closeSnack: CloseSnackFunc;
}

export function withSnacks<T extends WithSnacksProps>(
  component: ComponentType<T>,
): ComponentClass<Omit<T, keyof WithSnacksProps>>;

export function useSnacks(): [EnqueueSnackFunc, CloseSnackFunc];

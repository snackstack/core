import { ComponentType, ReactNode, ComponentClass } from 'react';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface ISnack {
  key?: string;
  message: string | ReactNode;
}

export interface ISnackOptions {
  maxSnacks?: number;
  autoHideDuration?: number;
}

export interface ISnackProviderProps {
  options?: ISnackOptions;
}

export const SnackProvider: ComponentType<ISnackProviderProps>;

type EnqueueSnackFuncType = (snack: ISnack) => string;
type CloseSnackFuncType = (key: string) => void;

export interface IWithSnacksProps {
  enqueueSnack: EnqueueSnackFuncType;
  closeSnack: CloseSnackFuncType;
}

export function withSnacks<T extends IWithSnacksProps>(
  component: ComponentType<T>
): ComponentClass<Omit<T, keyof IWithSnacksProps>>;

export function useSnacks(): [EnqueueSnackFuncType, CloseSnackFuncType];

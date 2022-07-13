import React, { FC, PropsWithChildren } from 'react';
import { SnackManager } from './SnackManager';
import { SnackManagerContext } from './SnackManagerContext';

export type SnackProviderProps = PropsWithChildren<{
  manager: SnackManager;
}>;

export const SnackProvider: FC<SnackProviderProps> = props => {
  return <SnackManagerContext.Provider value={props.manager}>{props.children}</SnackManagerContext.Provider>;
};

import React, { FC, PropsWithChildren } from 'react';
import { SnackManager } from './SnackManager';
import { SnackManagerContext } from './SnackManagerContext';

type Props = PropsWithChildren<{
  manager: SnackManager;
}>;

export const SnackProvider: FC<Props> = props => {
  return <SnackManagerContext.Provider value={props.manager}>{props.children}</SnackManagerContext.Provider>;
};

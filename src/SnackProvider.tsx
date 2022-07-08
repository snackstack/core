import React, { FC, PropsWithChildren, useRef } from 'react';
import { SnackProviderOptions } from './types/SnackProviderOptions';
import { SnackManager } from './SnackManager';
import { SnackManagerContext } from './SnackManagerContext';

type Props = {
  options?: Partial<SnackProviderOptions>;
};

export const SnackProvider: FC<PropsWithChildren<Props>> = props => {
  const { current: manager } = useRef(new SnackManager(props.options));

  return <SnackManagerContext.Provider value={manager}>{props.children}</SnackManagerContext.Provider>;
};

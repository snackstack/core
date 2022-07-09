import React, { FC, PropsWithChildren, useRef } from 'react';
import { SnackProviderOptions } from './types/SnackProviderOptions';
import { Manager } from './SnackManager';
import { SnackManagerContext } from './SnackManagerContext';

type Props = PropsWithChildren<{
  options?: Partial<SnackProviderOptions>;
}>;

export const SnackProvider: FC<Props> = props => {
  const { current: manager } = useRef(new Manager(props.options));

  return <SnackManagerContext.Provider value={manager}>{props.children}</SnackManagerContext.Provider>;
};

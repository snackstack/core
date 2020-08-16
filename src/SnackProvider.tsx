import React, { FC, useMemo } from 'react';
import { SnackProviderOptions } from './types/snackProviderOptions';
import { SnackContext, SnackContextType } from './SnackContext';
import { SnackManager } from './SnackManager';
import { SnackRenderer } from './SnackRenderer';

interface ComponentProps {
  options?: Partial<SnackProviderOptions>;
}

export const SnackProvider: FC<ComponentProps> = props => {
  const manager = useMemo(() => new SnackManager(props.options), [props.options]);

  const contextValue = useMemo<SnackContextType>(
    () => ({
      enqueueSnack: manager.enqueue,
      closeSnack: manager.close,
      updateSnack: manager.update,
      updateProviderOptions: manager.updateOptions,
      removeSnack: manager.remove,
    }),
    [manager]
  );

  return (
    <SnackContext.Provider value={contextValue}>
      {props.children}

      <SnackRenderer manager={manager} />
    </SnackContext.Provider>
  );
};

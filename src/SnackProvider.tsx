import React, { ComponentType, PropsWithChildren, useMemo } from 'react';
import { SnackProviderOptions } from './types/SnackProviderOptions';
import { SnackManager } from './SnackManager';
import { SnackContainer } from './SnackContainer';
import { SnackContext } from './SnackContext';
import { SnackRendererProps } from './types/SnackRendererProps';

type ReactContextType<T> = T extends React.Context<infer U> ? U : never;
type SnackContextType = ReactContextType<typeof SnackContext>;

interface Props<C extends SnackRendererProps> {
  options?: Partial<SnackProviderOptions>;
  // renderer: ComponentType<C>;
  // rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
}

export function SnackProvider<C extends SnackRendererProps>(props: PropsWithChildren<Props<C>>) {
  const manager = useMemo(() => new SnackManager(props.options), [props.options]);

  const contextValue = useMemo<SnackContextType>(
    () => ({
      enqueueSnack: manager.enqueue,
      closeSnack: id => manager.update(id, { open: false }),
      updateSnack: manager.update,
    }),
    [manager]
  );

  return (
    <SnackContext.Provider value={contextValue}>
      {props.children}

      <SnackContainer<C>
        manager={manager}
        // renderer={props.renderer} rendererProps={props.rendererProps}
      />
    </SnackContext.Provider>
  );
}

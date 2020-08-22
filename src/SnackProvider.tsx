import React, { ComponentType, PropsWithChildren, useMemo } from 'react';
import { SnackProviderOptions } from './types/SnackProviderOptions';
import { SnackContext, SnackContextType } from './SnackContext';
import { SnackManager } from './SnackManager';
import { SnackContainer } from './SnackContainer';
import { SnackRendererProps } from './types/SnackRendererProps';

interface ComponentProps<C extends SnackRendererProps> {
  options?: Partial<SnackProviderOptions>;
  renderer: ComponentType<C>;
  rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
}

export function SnackProvider<C extends SnackRendererProps>(props: PropsWithChildren<ComponentProps<C>>) {
  const manager = useMemo(() => new SnackManager(props.options), [props.options]);

  const contextValue = useMemo<SnackContextType>(
    () => ({
      enqueueSnack: manager.enqueue,
      closeSnack: id => manager.update(id, { open: false }),
      updateSnack: manager.update,
      updateProviderOptions: manager.updateOptions,
      removeSnack: manager.remove,
    }),
    [manager]
  );

  return (
    <SnackContext.Provider value={contextValue}>
      {props.children}

      <SnackContainer<C> manager={manager} renderer={props.renderer} rendererProps={props.rendererProps} />
    </SnackContext.Provider>
  );
}

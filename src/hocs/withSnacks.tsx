import React, { ComponentType, forwardRef } from 'react';
import { SnackContext, SnackContextType } from '../contexts/SnackContext';
import hoistNonReactStatics from 'hoist-non-react-statics';

type WithSnacksProps = SnackContextType;

function getDisplayName<T extends WithSnacksProps>(Component: ComponentType<T>) {
  return Component.displayName || Component.name || 'Component';
}

export function withSnacks<T extends WithSnacksProps>(Component: ComponentType<T>): ComponentType<Partial<T>> {
  const ContextedComponent = forwardRef<unknown, T>((props, ref) => (
    <SnackContext.Consumer>
      {contextProps => (
        <Component
          ref={ref}
          {...props}
          enqueueSnack={contextProps.enqueueSnack}
          closeSnack={contextProps.closeSnack}
          updateSnack={contextProps.updateSnack}
        />
      )}
    </SnackContext.Consumer>
  ));

  if (process.env.NODE_ENV !== 'production')
    ContextedComponent.displayName = `withSnacks(${getDisplayName(Component)})`;

  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  hoistNonReactStatics(ContextedComponent, Component);

  // todo: how to type this HOC correctly?
  // @ts-ignore
  return ContextedComponent;
}

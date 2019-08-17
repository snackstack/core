import React from 'react';
import SnackContext from '../context/SnackContext';

export default (Component) => {
  const contextedComponent = React.forwardRef((props, ref) => (
    <SnackContext.Consumer>
      {(context) => (
        <Component
          {...props}
          ref={ref}
          enqueueSnack={context.enqueueSnack}
          closeSnack={context.closeSnack}
        />
      )}
    </SnackContext.Consumer>
  ));

  contextedComponent.displayName = `withSnacks(${Component.name})`;

  return contextedComponent;
};

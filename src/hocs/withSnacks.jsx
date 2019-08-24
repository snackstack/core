import React from 'react';
import SnackContext from '../context/SnackContext';

export default Component => {
  const contextedComponent = React.forwardRef((props, ref) => (
    <SnackContext.Consumer>
      {context => (
        <Component
          {...props}
          closeSnack={context.closeSnack}
          enqueueSnack={context.enqueueSnack}
          ref={ref}
        />
      )}
    </SnackContext.Consumer>
  ));

  contextedComponent.displayName = `withSnacks(${Component.name})`;

  return contextedComponent;
};

import React from "react";
import SnackContext from "../context/SnackContext";

export default Component => {
  return React.forwardRef(props => (
    <SnackContext.Consumer>
      {context => (
        <Component
          {...props}
          enqueueSnack={context.enqueueSnack}
          closeSnack={context.closeSnack}
        />
      )}
    </SnackContext.Consumer>
  ));
};

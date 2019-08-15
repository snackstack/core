import React, { Component } from "react";
import SnackContext from "./SnackContext";
import { Snackbar, SnackbarContent } from "@material-ui/core";

class SnackProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snacks: [],
      context: {
        enqueueSnack: this.enqueueSnack.bind(this),
        closeSnack: this.closeSnack.bind(this)
      }
    };
  }

  enqueueSnack = ({ message, key }) => {
    key = key || new Date().getTime();

    this.setState(prevState => ({
      snacks: [
        ...prevState.snacks,
        {
          key: key || new Date().getTime(),
          message: message
        }
      ]
    }));

    return key;
  };

  closeSnack = key => {
    this.setState(prevState => ({
      snacks: prevState.snacks.filter(i => i.key !== key)
    }));
  };

  render() {
    const { children } = this.props;
    const { snacks, context } = this.state;

    return (
      <SnackContext.Provider value={context}>
        {children}
        {snacks.map((snack, index) => (
          <Snackbar key={snack.key} open={true}>
            <SnackbarContent
              aria-describedby="client-snackbar"
              message={<span id="client-snackbar">{snack.message}</span>}
            />
          </Snackbar>
        ))}
      </SnackContext.Provider>
    );
  }
}

export default SnackProvider;

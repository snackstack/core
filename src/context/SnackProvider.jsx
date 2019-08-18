import React, { Component } from 'react';
import SnackContext from './SnackContext';
import SnackItem from '../SnackItem/SnackItem';

class SnackProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snacks: [],
      context: {
        enqueueSnack: this.enqueueSnack.bind(this),
        closeSnack: this.closeSnack.bind(this),
      },
    };
  }

  enqueueSnack = ({ message, key, ...options }) => {
    let messageKey = key;

    if (!messageKey) messageKey = new Date().getTime() + Math.random();

    this.setState(({ snacks }) => ({
      snacks: [
        ...snacks,
        {
          ...options,
          key: messageKey,
          open: true,
          message,
        },
      ],
    }));

    return key;
  };

  closeSnack = (key) => {
    this.handleCloseSnack(key, null, null);
  };

  handleCloseSnack = (key, event, reason) => {
    this.setState(({ snacks }) => ({
      snacks: snacks.map((snack) => {
        const newSnack = { ...snack };

        if (newSnack.key === key) newSnack.open = false;

        return newSnack;
      }),
    }));
  };

  handleExitedSnack = (key, event) => {
    this.setState(({ snacks }) => ({
      snacks: snacks.filter((snack) => snack.key !== key),
    }));
  };

  render() {
    const { options, children } = this.props;
    const { snacks, context } = this.state;

    return (
      <SnackContext.Provider value={context}>
        {children}
        {snacks.map((snack) => (
          <SnackItem
            key={snack.key}
            snack={snack}
            options={options}
            onClose={this.handleCloseSnack}
            onExited={this.handleExitedSnack}
          />
        ))}
      </SnackContext.Provider>
    );
  }
}

export default SnackProvider;

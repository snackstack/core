import React, { Component } from 'react';
import SnackContext from './context/SnackContext';
import SnackItem from './SnackItem/SnackItem';

class SnackProvider extends Component {
  snackQueue = [];

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

  enqueueSnack = ({ key, message, ...options }) => {
    let messageKey = key;

    if (!messageKey) messageKey = new Date().getTime() + Math.random();

    const snack = {
      ...options,
      key: messageKey,
      message,
      open: true,
    };

    this.snackQueue.push(snack);

    this.dequeueOldestSnack();

    return messageKey;
  };

  closeSnack = (key) => {
    this.handleCloseSnack(key, null, null);
  };

  handleCloseSnack = (key, event, reason) => {
    this.setState(
      ({ snacks }) => ({
        snacks: snacks.map((snack) => {
          const newSnack = { ...snack };

          if (newSnack.key === key) newSnack.open = false;

          return newSnack;
        }),
      }),
      () => setTimeout(this.dequeueOldestSnack, 500),
    );

    const { onClose } = this.props;

    if (onClose) onClose(event, reason);
  };

  handleExitedSnack = (key, event) => {
    this.setState(({ snacks }) => ({
      snacks: snacks.filter((snack) => snack.key !== key),
    }));

    const { onExited } = this.props;

    if (onExited) onExited(event);
  };

  dequeueOldestSnack = () => {
    if (this.snackQueue.length < 1) return;

    const { snacks: curSnacks } = this.state;
    const {
      options: { maxSnacks },
    } = this.props;

    if (curSnacks.length >= maxSnacks) return;

    const oldestSnack = this.snackQueue.shift();

    this.setState(({ snacks }) => ({
      snacks: [...snacks, oldestSnack],
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

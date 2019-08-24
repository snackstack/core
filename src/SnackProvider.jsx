import React, { Component } from 'react';
import SnackContext from './context/SnackContext';
import SnackItem from './SnackItem/SnackItem';

class SnackProvider extends Component {
  snackQueue = [];

  curSnacks = 0;

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

  getOffset(index) {
    let offset = 20;
    const spacing = 10;
    const { snacks } = this.state;

    for (let i = 0; i < index; i += 1) {
      if (i === index) break;

      const height = snacks[i].height || 52;

      offset += height + spacing;
    }

    return offset;
  }

  dequeueOldestSnack = () => {
    if (this.snackQueue.length < 1) return;

    const {
      options: { maxSnacks },
    } = this.props;

    if (this.curSnacks >= maxSnacks) return;

    const oldestSnack = this.snackQueue.shift();

    this.setState(({ snacks }) => ({
      snacks: [...snacks, oldestSnack],
    }));

    this.curSnacks += 1;
  };

  handleSetSnackHeight = (key, height) => {
    this.setState(({ snacks }) => ({
      snacks: snacks.map((snack) => {
        if (snack.key === key) {
          return {
            ...snack,
            height,
          };
        }

        return snack;
      }),
    }));
  };

  handleExitedSnack = (key, event) => {
    this.setState(
      ({ snacks }) => ({
        snacks: snacks.filter((snack) => snack.key !== key),
      }),
      () => {
        this.curSnacks -= 1;
      },
    );

    const { onExited } = this.props;

    if (onExited) onExited(event);
  };

  handleCloseSnack = (key, event, reason) => {
    this.setState(
      ({ snacks }) => ({
        snacks: snacks.map((snack) => {
          if (snack.key === key) {
            return {
              ...snack,
              open: false,
            };
          }

          return snack;
        }),
      }),
      () => setTimeout(this.dequeueOldestSnack, 500),
    );

    const { onClose } = this.props;

    if (onClose) onClose(event, reason);
  };

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

  render() {
    const { options, children } = this.props;
    const { snacks, context } = this.state;

    return (
      <SnackContext.Provider value={context}>
        {children}
        {snacks.map((snack, index) => (
          <SnackItem
            key={snack.key}
            snack={snack}
            offset={this.getOffset(index)}
            options={options}
            onClose={this.handleCloseSnack}
            onExited={this.handleExitedSnack}
            onSetSnackHeight={this.handleSetSnackHeight}
          />
        ))}
      </SnackContext.Provider>
    );
  }
}

SnackProvider.propTypes = {
  options: PropTypes.shape({
    maxSnacks: PropTypes.number,
    autoHideDuration: PropTypes.number,
  }),
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
};

SnackProvider.defaultProps = {
  options: {
    maxSnacks: 3,
    autoHideDuration: 2500,
  },
};

export default SnackProvider;

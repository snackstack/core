import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

      const { height: snackHeight } = snacks[i];

      const height = snackHeight || 52;

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
      snacks: snacks.map(snack => {
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
        snacks: snacks.filter(snack => snack.key !== key),
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
        snacks: snacks.map(snack => {
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
    const {
      options: { preventDuplicates },
    } = this.props;

    if (preventDuplicates) {
      const { snacks } = this.state;

      if (snacks.some(snack => snack.message === message)) return null;

      if (this.snackQueue.some(snack => snack.message === message)) return null;
    }

    const snack = {
      ...options,
      ...key,
      message,
      open: true,
    };

    if (!snack.key) {
      snack.key = new Date().getTime() + Math.random();
    }

    this.snackQueue.push(snack);

    this.dequeueOldestSnack();

    return snack.key;
  };

  closeSnack = key => {
    this.handleCloseSnack(key, null, null);
  };

  render() {
    const { children, options } = this.props;
    const { context, snacks } = this.state;

    return (
      <SnackContext.Provider value={context}>
        {children}
        {snacks.map((snack, index) => (
          <SnackItem
            key={snack.key}
            offset={this.getOffset(index)}
            options={options}
            snack={snack}
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
    anchorOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    }),
    preventDuplicates: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
};

SnackProvider.defaultProps = {
  options: {
    maxSnacks: 3,
    autoHideDuration: 2500,
    anchorOrigin: {
      horizontal: 'left',
      vertical: 'bottom',
    },
    preventDuplicates: true,
  },
};

export default SnackProvider;

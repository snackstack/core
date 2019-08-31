import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SnackContext from './context/SnackContext';
import SnackItem from './SnackItem/SnackItem';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import { CloseIcon } from './constants';
import { getTransitionDelay } from './helpers';

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

  getOffset(index) {
    const { snacks } = this.state;
    const { spacing } = this.props;

    const defaultSnackHeight = 56;
    let offset = 20;

    for (let i = 0; i < index; i += 1) {
      if (i === index) break;

      const { height: snackHeight } = snacks[i];

      const height = snackHeight || defaultSnackHeight;

      offset += height + spacing;
    }

    return offset;
  }

  dismissOldestSnack = allPersisted => {
    let dismissed = false;

    this.setState(({ snacks }) => ({
      snacks: snacks
        .filter(snack => snack.open)
        .map(snack => {
          if (!dismissed && (allPersisted || !snack.persist)) {
            dismissed = true;

            const { onClose } = this.props;

            if (onClose) onClose(snack.key, 'newsnack');

            return {
              ...snack,
              open: false,
            };
          }

          return snack;
        }),
    }));
  };

  dequeueOldestSnack = () => {
    if (this.snackQueue.length < 1) return;

    const { maxSnacks } = this.props;
    const { snacks } = this.state;

    if (snacks.length >= maxSnacks) {
      const persistedSnacks = snacks.reduce(
        (acc, snack) => acc + (snack.open && snack.persist),
        0,
      );

      const allPersisted = persistedSnacks === maxSnacks;

      this.dismissOldestSnack(allPersisted);
    }

    const oldestQueueSnack = this.snackQueue.shift();

    this.setState(({ snacks: oldSnacks }) => ({
      snacks: [...oldSnacks, oldestQueueSnack],
    }));
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

  handleEnterSnack = key => {
    const { onEnter } = this.props;

    if (onEnter) onEnter(key);
  };

  handleCloseSnack = (key, reason) => {
    this.setState(({ snacks }) => ({
      snacks: snacks.map(snack => {
        if (snack.key === key) {
          return {
            ...snack,
            open: false,
          };
        }

        return snack;
      }),
    }));

    const { onClose } = this.props;

    if (onClose) onClose(key, reason);
  };

  handleExitedSnack = key => {
    this.setState(
      ({ snacks }) => ({
        snacks: snacks.filter(snack => snack.key !== key),
      }),
      () => {
        const { TransitionProps } = this.props;

        setTimeout(
          this.dequeueOldestSnack,
          getTransitionDelay(TransitionProps),
        );
      },
    );

    const { onExited } = this.props;

    if (onExited) onExited(key);
  };

  enqueueSnack = ({ action, key, message, persist, ...options }) => {
    const {
      action: actionOption,
      persist: persistOption,
      preventDuplicates,
    } = this.props;

    if (preventDuplicates) {
      const { snacks } = this.state;

      if (snacks.some(snack => snack.message === message)) return null;

      if (this.snackQueue.some(snack => snack.message === message)) return null;
    }

    const snack = {
      ...options,
      message,
      key: key || new Date().getTime() + Math.random(),
      open: true,
      persist: persistOption || false,
      action: action || actionOption,
    };

    if (persist !== undefined) snack.persist = persist;

    this.snackQueue.push(snack);

    this.dequeueOldestSnack();

    return snack.key;
  };

  closeSnack = key => {
    this.handleCloseSnack(key, null, null);
  };

  render() {
    const { children, ...options } = this.props;
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
            onEnter={this.handleEnterSnack}
            onExited={this.handleExitedSnack}
            onSetSnackHeight={this.handleSetSnackHeight}
          />
        ))}
      </SnackContext.Provider>
    );
  }
}

SnackProvider.propTypes = {
  spacing: PropTypes.number,
  hideIcon: PropTypes.bool,
  maxSnacks: PropTypes.number,
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
  }),
  preventDuplicates: PropTypes.bool,
  persist: PropTypes.bool,
  action: PropTypes.func,
  TransitionComponent: PropTypes.elementType,
  TransitionProps: PropTypes.object,
  children: PropTypes.node.isRequired,
  onEnter: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
};

SnackProvider.defaultProps = {
  spacing: 12,
  hideIcon: false,
  maxSnacks: 3,
  autoHideDuration: 2500,
  anchorOrigin: {
    horizontal: 'left',
    vertical: 'bottom',
  },
  preventDuplicates: true,
  persist: false,
  TransitionComponent: Slide,
  // eslint-disable-next-line react/display-name
  action: ({ classes, closeSnack }) => (
    <IconButton onClick={closeSnack}>
      <CloseIcon className={classNames(classes.icon, classes.iconAction)} />
    </IconButton>
  ),
};

export default SnackProvider;

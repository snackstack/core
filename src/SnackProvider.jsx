import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SnackContext from './context/SnackContext';
import SnackItem from './SnackItem/SnackItem';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import { CloseIcon } from './constants';
import { getTransitionDelay } from './helpers';
import { snackItemVariantIcons } from './SnackItem/SnackItemStyles';

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

            if (onClose) onClose(null, 'newsnack', snack.key);

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

  handleSnackChangeHeight = (key, height) => {
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

  handleSnackClose = (event, reason, key) => {
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

    if (onClose) onClose(event, reason, key);
  };

  handleSnackEnter = key => {
    const { onEnter } = this.props;

    if (onEnter) onEnter(key);
  };

  handleSnackEntered = key => {
    const { onEntered } = this.props;

    if (onEntered) onEntered(key);
  };

  handleSnackEntering = key => {
    const { onEntering } = this.props;

    if (onEntering) onEntering(key);
  };

  handleSnackExit = key => {
    const { onExit } = this.props;

    if (onExit) onExit(key);
  };

  handleSnackExited = key => {
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

  handleSnackExiting = key => {
    const { onExiting } = this.props;

    if (onExiting) onExiting(key);
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
    this.handleSnackClose(null, 'manually', key);
  };

  render() {
    // todo find better suited method of not passing down unwanted props via otherProps
    const {
      // eslint-disable-next-line no-unused-vars
      action,
      children,
      iconVariants,
      // eslint-disable-next-line no-unused-vars
      maxSnacks,
      // eslint-disable-next-line no-unused-vars
      persist,
      // eslint-disable-next-line no-unused-vars
      preventDuplicates,
      ...otherProps
    } = this.props;
    const { context, snacks } = this.state;

    const overwrittenIconVariants = Object.assign(
      snackItemVariantIcons,
      iconVariants,
    );

    return (
      <SnackContext.Provider value={context}>
        {children}
        {snacks.map((snack, index) => (
          <SnackItem
            {...otherProps}
            closeSnack={this.closeSnack}
            iconVariants={overwrittenIconVariants}
            key={snack.key}
            offset={this.getOffset(index)}
            snack={snack}
            onChangeHeight={this.handleSnackChangeHeight}
            onClose={this.handleSnackClose}
            onEnter={this.handleSnackEnter}
            onEntered={this.handleSnackEntered}
            onEntering={this.handleSnackEntering}
            onExit={this.handleSnackExit}
            onExited={this.handleSnackExited}
            onExiting={this.handleSnackExiting}
          />
        ))}
      </SnackContext.Provider>
    );
  }
}

SnackProvider.propTypes = {
  classes: PropTypes.object,
  spacing: PropTypes.number,
  hideIcon: PropTypes.bool,
  iconVariants: PropTypes.shape({
    error: PropTypes.any,
    warning: PropTypes.any,
    info: PropTypes.any,
    success: PropTypes.any,
  }),
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
  resumeHideDuration: PropTypes.number,
  disableWindowBlurListener: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onEnter: PropTypes.func,
  onEntered: PropTypes.func,
  onEntering: PropTypes.func,
  onExit: PropTypes.func,
  onExited: PropTypes.func,
  onExiting: PropTypes.func,
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
  preventDuplicates: false,
  persist: false,
  TransitionComponent: props => <Slide {...props} />,
  // eslint-disable-next-line react/prop-types
  action: ({ classes, closeSnack }) => (
    <IconButton onClick={closeSnack}>
      {/* eslint-disable-next-line react/prop-types */}
      <CloseIcon className={classNames(classes.icon, classes.iconAction)} />
    </IconButton>
  ),
};

export default SnackProvider;

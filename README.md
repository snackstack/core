# snackstack [![](https://img.shields.io/npm/v/snackstack?color=F50057)](https://www.npmjs.com/package/snackstack) [![](https://img.shields.io/npm/dm/snackstack?color=1976D2)](https://www.npmjs.com/package/snackstack) [![](https://img.shields.io/npm/l/snackstack?color=00C853)](https://www.npmjs.com/package/snackstack)

Easy-to-use extension of [Material-UI](https://github.com/mui-org/material-ui), which allows the stacking of Snackbar notification messages.

## Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Handling Notifications](#handling-notifications)
- [Documentation](#documentation)

## Installation

| Method | Command                  |
| :----- | :----------------------- |
| npm    | `npm install snackstack` |
| yarn   | `yarn add snackstack`    |

## Getting started

Wrap all components, which should be able to enqueue or close Snackbar Notifications, in a `SnackProvider`:

```js
import { SnackProvider } from 'snackstack';

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root'),
);
```

If you're using `MuiThemeProvider` make sure that you place the `SnackProvider` inside of it.

## Handling Notifications

### withSnacks

The `withSnacks` HOC injects the `enqueueSnack` and `closeSnack` function into your component's `props`:

```jsx
import { withSnacks } from 'snackstack';

class ExampleComponent extends React.Component {
  handleEnqueueClick = () => {
    const { enqueueSnack } = this.props;

    enqueueSnack({ message: 'Hello World', key: 'key123' });
  };

  handleCloseClick = () => {
    const { closeSnack } = this.props;

    closeSnack('key123');
  };

  render() {
    return (
      <div>
        <button onClick={this.handleEnqueueClick}>Enqueue</button>
        <button onClick={this.handleCloseClick}>Close</button>
      </div>
    );
  }
}

export default withSnacks(ExampleComponent);
```

### useSnacks

The `useSnacks` Hook returns an array containing the `enqueueSnack` and `closeSnack` function:

```jsx
import { useSnacks } from 'snackstack';

const ExampleComponent = () => {
  const [enqueueSnack, closeSnack] = useSnacks();

  const handleEnqueueClick = () => {
    enqueueSnack({ message: 'Hello World', key: 'key123' });
  };

  const handleCloseClick = () => {
    closeSnack('key123');
  };

  return (
    <div>
      <button onClick={handleEnqueueClick}>Enqueue</button>
      <button onClick={handleCloseClick}>Close</button>
    </div>
  );
};

export default ExampleComponent;
```

If you're unfamiliar with Hooks I suggest [this](https://reactjs.org/docs/hooks-intro.html) article as an introduction.

## Documentation

_Not yet available_

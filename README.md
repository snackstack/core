# snackstack [![](https://img.shields.io/npm/v/snackstack?color=F50057)](https://www.npmjs.com/package/snackstack) [![](https://img.shields.io/npm/dm/snackstack?color=1976D2)](https://www.npmjs.com/package/snackstack) [![](https://img.shields.io/npm/l/snackstack?color=00C853)](https://www.npmjs.com/package/snackstack)

Easy-to-use extension of [Material-UI](https://github.com/mui-org/material-ui), which allows the stacking of Snackbar notification messages.

## Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Documentation](#documentation)

## Installation

| Method | Command                  |
| :----- | :----------------------- |
| NPM    | `npm install snackstack` |
| YARN   | `yarn add snackstack`    |

## Getting started

Wrap all components, which should be able to enqueue or close Snackbar Notifications, in a `SnackProvider`:

```js
import { SnackProvider } from 'snackstack';

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root')
);
```

If you're using `MuiThemeProvider` make sure that you place the `SnackProvider` inside of it.

### withSnacks

The `withSnacks` HOC injects the `enqueueSnack` and `closeSnack` function into your component's `props`:

```jsx
import { withSnacks } from 'snackstack';

class ExampleComponent extends React.Component {
  onEnqueueClick = () => {
    const { enqueueSnack } = this.props;

    enqueueSnack({ message: 'Hello World', key: 'key123' });
  };

  onCloseClick = () => {
    const { closeSnack } = this.props;

    closeSnack('key123');
  };

  render() {
    return (
      <div>
        <button onClick={this.onEnqueueClick}>Enqueue</button>
        <button onClick={this.onCloseClick}>Close</button>
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

  const onEnqueueClick = () => {
    enqueueSnack({ message: 'Hello World', key: 'key123' });
  };

  const onCloseClick = () => {
    closeSnack('key123');
  };

  return (
    <div>
      <button onClick={onEnqueueClick}>Enqueue</button>
      <button onClick={onCloseClick}>Close</button>
    </div>
  );
};

export default ExampleComponent;
```

If you're unfamiliar with Hooks I suggest [this](https://reactjs.org/docs/hooks-intro.html) article as an introduction.

## Documentation

_Not yet available_

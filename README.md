![Logo with Text](./assets/logo-text-dark.svg#gh-light-mode-only)
![Logo with Text](./assets/logo-text-light.svg#gh-dark-mode-only)

<p align="center">
  <a href="https://www.npmjs.com/package/@snackstack/core" alt="npm.js package link">
    <img src="https://img.shields.io/npm/v/@snackstack/core?color=F50057" alt="Latest version published to npm.js" />
    <img src="https://img.shields.io/npm/dm/@snackstack/core?color=1976D2" alt="npm downloads per month" />
    <img src="https://img.shields.io/npm/l/@snackstack/core?color=00C853" alt="Project license" />
  </a>
</p>

`@snackstack/core` is a component library agnostic way to manage the queueing behavior of notifications, without any dependencies on third party state management solutions.

## Installation

To install the latest stable version with [npm](https://www.npmjs.com/get-npm), run the following command:

```
npm install @snackstack/core
```

Or if you're using [yarn](https://classic.yarnpkg.com/docs/install/):

```
yarn add @snackstack/core
```

## Setup

Once you have installed snackstack, import the `SnackProvider` component and the `SnackManager` class.

Instantiate a new instance of the `SnackManager` class and optionally pass an options object of type `SnackManagerOptions` to its constructor.

Now that the manager is setup, wrap the `SnackProvider` around the parts of your application that should be able to manage and display notifications. The newly created `SnackManager` instance needs to be passed as value to the `manager` property on the provider.

```diff
import React from "react";
import ReactDOM from "react-dom/client";
+ import { SnackProvider, SnackManager } from "@snackstack/core";

+ const snackManager = new SnackManager({ maxSnacks: 7 });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
+   <SnackProvider manager={snackManager}>
      <App />
+   </SnackProvider>
  </React.StrictMode>
);
```

Now you can use the `useSnackManager` hook to manage notifications in any component below the `SnackProvider`.

```tsx
import { useSnackManager } from '@snackstack/core';

function App() {
  const manager = useSnackManager();

  const handleClick = () => {
    manager.enqueue('A notification');
  };

  return <button onClick={handleClick}>Show notification</button>;
}
```

Don't worry if this code does not appear to do anything, this is because we have not specified a rendering mechanism for our notifications - remember `@snackstack/core` is agnostic to any component library and so forth!

The quickest way to render your notifications is by using one of our pre-built adapters:

- [@snackstack/mui](https://github.com/snackstack/mui): Adapter for [Material UI](https://mui.com)

[Learn more about managing notifications](https://snackstack.github.io/docs/guides/managing-notifications)

[Learn more about displaying notifications](https://snackstack.github.io/docs/guides/displaying-notifications)

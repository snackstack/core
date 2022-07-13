<p align="center" style="font-size: 30px;">@snackstack/core</p>
<p align="center">Component / state management library agnostic way to manage notifications</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@snackstack/core" alt="npm.js package link">
    <img src="https://img.shields.io/npm/v/@snackstack/core?color=F50057" alt="Latest version published to npm.js" />
    <img src="https://img.shields.io/npm/dm/@snackstack/core?color=1976D2" alt="npm downloads per month" />
    <img src="https://img.shields.io/npm/l/@snackstack/core?color=00C853" alt="Project license" />
  </a>
</p>

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

Once you have installed snackstack, import the `SnackProvider` and `SnackStack` component, as well as the `SnackManager` class.

Instantiate a new instance of the `SnackManager` class and optionally pass an options object of type `SnackManagerOptions` to its constructor.

Now that the manager is setup, wrap the `SnackProvider` around the parts of your application that should be able to manage and display notifications. The newly created `SnackManager` instance needs to be passed as value to the `manager` property on the provider.

Place the `SnackStack` component somewhere below the `SnackProvider` and specify a component used to render your notifications.

```diff
import React from 'react';
import ReactDOM from 'react-dom/client';
+ import { SnackProvider, SnackStack, SnackManager } from '@snackstack/core';

+ const snackManager = new SnackManager({ maxSnacks: 7 });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
+   <SnackProvider manager={snackManager}>
      <App />

+     <SnackStack Component={MyNotification} />
+   </SnackProvider>
  </React.StrictMode>
);

+ const MyNotification = React.forwardRef<unknown, SnackProps>(({ message, offset }) => {
+   return <div style={{ top: offset }}>{message}</div>;
+ });
```

While this gives you full creative freedom to design your notification component, you might prefer a pre-built solution:

- [@snackstack/mui](https://github.com/snackstack/mui): Adapter for [Material UI](https://mui.com)

[Learn more about displaying notifications](https://snackstack.github.io/docs/guides/displaying-notifications)

## Managing notifications

Once setup, notifications can be managed through the `SnackManager`. You can either use the instance you previously instantiated or the `useSnackManager` hook (works only in components rendered below the `SnackProvider`).

```diff
+ import { useSnackManager } from '@snackstack/core';

function App() {
+ const manager = useSnackManager();

  const handleClick = () => {
+   manager.enqueue('A notification');
  };

  return <button onClick={handleClick}>Show notification</button>;
}
```

[Learn more about managing notifications](https://snackstack.github.io/docs/guides/managing-notifications)

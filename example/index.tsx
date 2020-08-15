import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';

const App = () => {
  const { enqueueSnack } = useSnacks();

  const handleEnqueue = () => {
    enqueueSnack({ message: <div>Hello World!</div> });
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

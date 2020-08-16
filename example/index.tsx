import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';

let id = 0;

const App = () => {
  const { enqueueSnack } = useSnacks();

  const handleEnqueue = () => {
    enqueueSnack({ message: <div>Num: {++id}</div> });
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

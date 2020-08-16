import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';

let id = 0;

const App = () => {
  const { enqueueSnack } = useSnacks();

  const handleEnqueue = () => {
    ++id;

    enqueueSnack({ message: <div>Num: {id}</div>, persist: id % 2 === 0 });
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';

let id = 0;

const App = () => {
  const { enqueueSnack, updateProviderOptions } = useSnacks();

  const handleEnqueue = () => {
    ++id;

    enqueueSnack({ id, message: <div>Num: {id}</div>, persist: id % 2 === 0 });
  };

  const handleChangeOrigin = () => {
    updateProviderOptions({ anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
  };

  return (
    <div>
      <button onClick={handleEnqueue}>Enqueue</button>
      <button onClick={handleChangeOrigin}>Change origin</button>
    </div>
  );
};

ReactDOM.render(
  <SnackProvider>
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

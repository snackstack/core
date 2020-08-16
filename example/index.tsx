import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';

const Expandable = ({ id }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ height: open ? 200 : 30 }}>
      <div>Num: {id}</div>
      <button onClick={() => setOpen(prev => !prev)}>CHange Height</button>
    </div>
  );
};

let id = 0;

const App = () => {
  const { enqueueSnack, updateProviderOptions } = useSnacks();

  const handleEnqueue = () => {
    ++id;

    enqueueSnack({ id, dynamicHeight: true, message: <Expandable id={id} />, persist: id % 2 === 0 });
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

import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../dist';
import { SnackRendererProps } from '../dist/types/SnackRendererProps';

let id = 1;

const App = () => {
  const { enqueueSnack } = useSnacks();

  const handleEnqueue = () => {
    enqueueSnack('Snack: ' + id);

    id++;
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

interface TestRendererProps extends SnackRendererProps {
  customProp: string;
}

const TestRenderer: React.FC<TestRendererProps> = ({ snack, ...props }) => {
  React.useEffect(() => {
    if (!props.autoHideDuration) return;

    const timeout = setTimeout(props.onRemove, props.autoHideDuration);

    return () => clearTimeout(timeout);
  }, [props.autoHideDuration]);

  return (
    <div
      // @ts-ignore
      ref={props.snackRef}
      style={{
        bottom: 20 + props.index * props.spacing + props.heightOffset,
        position: 'absolute',
        MozTransition: 'all 500ms',
        msTransition: 'all 500ms',
        transition: 'all 500ms',
      }}
    >
      {snack.message} ({props.customProp})
    </div>
  );
};

ReactDOM.render(
  <SnackProvider
    options={{
      maxSnacks: 8,
    }}
    renderer={TestRenderer}
    rendererProps={{ customProp: "I'm custom" }}
  >
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

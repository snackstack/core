import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks, SnackRendererProps } from '../dist';

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

  const transtion = `all ${props.transitionDelay}ms`;

  const style: React.CSSProperties = {
    bottom: 20 + props.index * props.spacing + props.heightOffset,
    background: '#424242',
    padding: '8px 10px',
    color: 'white',
    position: 'absolute',
    MozTransition: transtion,
    msTransition: transtion,
    transition: transtion,
  };

  return (
    <div
      // @ts-ignore
      ref={props.snackRef}
      style={style}
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

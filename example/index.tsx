import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnackProvider, useSnacks } from '../.';
import Button from '@material-ui/core/Button/Button';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActions,
  createStyles,
  makeStyles,
  Slide,
  Snackbar,
  SnackbarContent,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { SnackRendererProps } from '../dist/types/SnackRendererProps';
import { amber, blue, green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme =>
  createStyles({
    message: {
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    },
    icon: {
      color: '#fff',
      fontSize: 24,
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    iconAction: {
      fontSize: 20,
    },
    error: {
      backgroundColor: red[600],
    },
    warning: {
      backgroundColor: amber[800],
    },
    info: {
      backgroundColor: blue[500],
    },
    success: {
      backgroundColor: green[500],
    },
  })
);

const Expandable = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Accordion ref={ref} {...props} expanded={open} onChange={() => setOpen(prev => !prev)} style={{ width: 320 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>I am expandable</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
});

let id = 0;

const App = () => {
  const { enqueueSnack, updateProviderOptions } = useSnacks();

  const handleEnqueue = () => {
    if (id === 0) {
      enqueueSnack('I am a default notification');
    }
    if (id === 1) {
      enqueueSnack({ message: 'I am a success!', variant: 'success' });
    }
    if (id === 2) {
      enqueueSnack({ message: 'I am an error!', variant: 'error' });
    }
    if (id === 3) {
      enqueueSnack({
        message: 'I am interactive',
        variant: 'info',
        action: snack => (
          <Button style={{ color: 'white' }} onClick={() => alert('My id is ' + snack.id)}>
            Find out my Id
          </Button>
        ),
      });
    }
    if (id === 4) {
      enqueueSnack({
        message: 'I am persisted',
        variant: 'warning',
        persist: true,
        action: (_, close) => (
          <Button style={{ color: 'white' }} onClick={close}>
            Got it
          </Button>
        ),
      });
    }
    if (id === 5) {
      enqueueSnack({
        message: (
          <Card style={{ width: 320, display: 'flex', alignItems: 'center' }}>
            <Typography style={{ flex: 1 }}>I'm a custom Snack! :)</Typography>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => alert('Test')}>
                Test
              </Button>
            </CardActions>
          </Card>
        ),
      });
    }

    if (id === 6) {
      enqueueSnack({ message: <Expandable />, dynamicHeight: true });
      id = 0;
    } else id++;
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

interface TestRendererProps extends SnackRendererProps {
  test: number;
}

const SlideTransition = props => <Slide {...props} />;

const TestRenderer: React.FC<TestRendererProps> = ({ index, snack, ...props }) => {
  const styles = useStyles();

  const style: React.CSSProperties = {
    bottom: props.offset,
  };

  if (props.offset <= props.previousOffset) {
    const transitionDelay = 500;
    style.MozTransition = `all ${transitionDelay}ms`;
    style.msTransition = `all ${transitionDelay}ms`;
    style.transition = `all ${transitionDelay}ms`;
  }

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    props.onClose(snack.id);
  };

  const content = React.isValidElement(snack.message) ? snack.message : null;

  return (
    /* @ts-ignore */
    <Snackbar
      ref={props.snackRef}
      key={snack.id}
      open={snack.open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      style={style}
      autoHideDuration={props.autoHideDuration}
      onClose={handleClose}
      onExited={() => props.onExited(snack.id)}
      TransitionComponent={SlideTransition}
    >
      {/* @ts-ignore */}
      {content || (
        <SnackbarContent
          className={styles[snack.variant as keyof typeof useStyles]}
          message={<div className={styles['message']}>{snack.message}</div>}
          action={props.action}
        />
      )}
    </Snackbar>
  );
};

ReactDOM.render(
  <SnackProvider
    options={{
      maxSnacks: 8,
    }}
    renderer={TestRenderer}
    rendererProps={{ test: 12 }}
  >
    <App />
  </SnackProvider>,
  document.getElementById('root')
);

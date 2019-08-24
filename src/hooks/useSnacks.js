import { useContext } from 'react';
import SnackContext from '../context/SnackContext';

export default () => {
  const { closeSnack, enqueueSnack } = useContext(SnackContext);

  return [enqueueSnack, closeSnack];
};

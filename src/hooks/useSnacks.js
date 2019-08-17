import { useContext } from 'react';
import SnackContext from '../context/SnackContext';

export default () => {
  const { enqueueSnack, closeSnack } = useContext(SnackContext);

  return [enqueueSnack, closeSnack];
};

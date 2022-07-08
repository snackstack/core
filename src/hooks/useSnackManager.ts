import { useContext, useDebugValue } from 'react';
import { SnackManagerContext } from '../SnackManagerContext';

export function useSnackManager() {
  const manager = useContext(SnackManagerContext);

  useDebugValue('useSnackManager');

  return manager;
}

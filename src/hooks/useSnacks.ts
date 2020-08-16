import { useContext, useDebugValue } from 'react';
import { SnackContext } from '../SnackContext';

export function useSnacks() {
  const context = useContext(SnackContext);

  useDebugValue('useSnacks');

  return context;
}

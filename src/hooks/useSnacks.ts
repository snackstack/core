import { useContext, useDebugValue } from 'react';
import { SnackContext, SnackContextType } from '../contexts/SnackContext';

export function useSnacks(): SnackContextType {
  const context = useContext(SnackContext);

  useDebugValue('useSnacks');

  return context;
}

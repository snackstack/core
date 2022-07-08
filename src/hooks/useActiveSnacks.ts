import { useCallback, useDebugValue } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { SnackManager } from '../SnackManager';
import { useSnackManager } from './useSnackManager';

export function useActiveSnacks() {
  const manager = useSnackManager() as SnackManager;

  useDebugValue('useActiveSnacks');

  const getSnapshot = useCallback(manager.getState, [manager]);

  return useSyncExternalStore(manager.subscribe, getSnapshot);
}

import { useCallback, useDebugValue } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { SnackManager } from '../SnackManager';
import { useSnackManager } from './useSnackManager';

export function useActiveSnacks() {
  const manager = useSnackManager() as SnackManager;

  useDebugValue('useActiveSnacks');

  console.log('useActiveSnacks');

  const getSnapshot = useCallback(manager.getState, [manager]);

  const activeSnacks = useSyncExternalStore(manager.subscribe, getSnapshot);

  return activeSnacks;
}

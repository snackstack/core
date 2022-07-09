import { useCallback, useDebugValue } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSnackManager } from './useSnackManager';

export function useActiveSnacks() {
  const manager = useSnackManager();

  useDebugValue('useActiveSnacks');

  console.log('useActiveSnacks');

  const getSnapshot = useCallback(manager.getActiveSnacks, [manager]);

  const activeSnacks = useSyncExternalStore(manager.subscribe, getSnapshot);

  return activeSnacks;
}

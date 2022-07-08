import { useCallback, useDebugValue, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { SnackManager } from '../SnackManager';
import { useSnackManager } from './useSnackManager';

export function useActiveSnacks() {
  const manager = useSnackManager() as SnackManager;

  useDebugValue('useActiveSnacks');

  const getSnapshot = useCallback(manager.getState, [manager]);

  const activeSnacks = useSyncExternalStore(manager.subscribe, getSnapshot);

  return useMemo(
    () =>
      activeSnacks.map(snack => {
        if (typeof snack.action === 'function') {
          return { ...snack, action: snack.action(snack) };
        }

        return snack;
      }),
    [activeSnacks]
  );
}

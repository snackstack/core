import { ReactNode, useCallback, useDebugValue, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { SnackManager } from '../SnackManager';
import { Snack } from '../types';
import { useSnackManager } from './useSnackManager';

type ActiveSnack = Snack & {
  action: ReactNode;
  index: number;
};

export function useActiveSnacks() {
  const manager = useSnackManager() as SnackManager;

  useDebugValue('useActiveSnacks');

  const getSnapshot = useCallback(manager.getState, [manager]);

  const activeSnacks = useSyncExternalStore(manager.subscribe, getSnapshot);

  return useMemo(
    () =>
      activeSnacks.map<ActiveSnack>((snack, index) => {
        const activeSnack = { ...snack } as ActiveSnack;

        if (typeof snack.action === 'function') {
          activeSnack.action = snack.action(snack);
        }

        activeSnack.index = index;

        return activeSnack;
      }),
    [activeSnacks]
  );
}

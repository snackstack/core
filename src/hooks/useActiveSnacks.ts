import { useSnackManager } from 'hooks';
import { useDebugValue } from 'react';
import { SnackManager } from 'SnackManager';
import { useSyncExternalStore } from 'use-sync-external-store';

export function useActiveSnacks() {
  const manager = useSnackManager() as SnackManager;

  useDebugValue('useActiveSnacks');

  return useSyncExternalStore(manager.subscribe, manager.getItems);
}

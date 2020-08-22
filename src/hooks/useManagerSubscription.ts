import { useEffect, useMemo, useReducer } from 'react';
import { SnackManager } from '../SnackManager';

export function useManagerSubscription(manager: SnackManager) {
  const [, forceRender] = useReducer(s => s + 1, 0);

  useEffect(() => {
    manager.rerenderSubscribers = forceRender;
  }, [manager]);

  return useMemo(
    () => ({
      activeIds: manager.activeIds,
      items: manager.items,
      options: manager.options,
      enqueue: manager.enqueue,
      dequeue: manager.dequeue,
      update: manager.update,
      remove: manager.remove,
    }),
    [manager]
  );
}

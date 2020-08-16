import { useCallback, useState } from 'react';
import { Id, Store } from './useStore';

// todo: semantics of deque and remove are not fitting for this scenario
export function useQueue<TId extends Id, TItem>(
  store: Store<TId, TItem>,
  limit: number,
  onFullQueue?: (activeItemIds: TId[]) => void
) {
  const [activeIds, setActiveIds] = useState<TId[]>([]);

  const dequeue = useCallback(() => {
    if (store.ids.length < activeIds.length) return;

    if (activeIds.length >= limit) {
      if (onFullQueue) onFullQueue(activeIds);

      return;
    }

    const nextId = store.ids[activeIds.length];

    if (!nextId) return;

    setActiveIds(prev => [...prev, nextId]);
  }, [store.ids, activeIds, limit]);

  const remove = (id: TId) => {
    setActiveIds(prev => prev.filter(i => i !== id));

    store.remove(id);
  };

  return { enqueue: store.add, dequeue: dequeue, activeIds, remove };
}

import { useCallback, useState } from 'react';

export type Id = string | number;

type KeyedItems<TId extends Id, TItem> = {
  [key in TId]: TItem;
};

export interface Store<TId extends Id, TItem> {
  add(item: TItem): void;
  update(id: TId, props: Partial<TItem>): void;
  remove(id: TId): void;
  ids: TId[];
  items: KeyedItems<TId, TItem>;
}

export function useStore<TId extends Id, TItem>(getItemId: (item: TItem) => TId): Store<TId, TItem> {
  const [items, setItems] = useState({} as KeyedItems<TId, TItem>);
  const [ids, setIds] = useState<TId[]>([]);

  const add = useCallback((item: TItem) => {
    const id = getItemId(item);

    setItems(prev => ({ ...prev, [id]: item }));

    setIds(prev => [...prev, id]);
  }, []);

  const update = useCallback((id: TId, props: Partial<TItem>) => {
    setItems(prev => ({ ...prev, [id]: { ...prev[id], ...props } }));
  }, []);

  const remove = useCallback((id: TId) => {
    setIds(prev => prev.filter(i => i !== id));

    setItems(prev => ({ ...prev, [id]: undefined }));
  }, []);

  return { add, update, remove, ids, items };
}

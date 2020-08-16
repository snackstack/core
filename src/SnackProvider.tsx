import React, { FC, useCallback, useEffect, useState } from 'react';
import { SnackItem } from './SnackItem';
import { useStore, useQueue } from './hooks';
import { MergedSnack, SnackId } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';
import { getOptions as getDefaultOptions, getOffset } from './helpers';
import { SnackContext, SnackContextType } from './SnackContext';

interface ComponentProps {
  options?: Partial<SnackProviderOptions>;
}

export const SnackProvider: FC<ComponentProps> = props => {
  const [options, setOptions] = useState<SnackProviderOptions>(getDefaultOptions(props.options));

  const store = useStore<SnackId, MergedSnack>(item => item.id);

  // todo: this is only checked on enqueue if there are multiple peristed items still in queue
  //       they non persisted items will never show
  const handleFullQueue = (activeItemIds: SnackId[]) => {
    const persistedSnacks = activeItemIds.reduce((acc: number, cur) => acc + (store.items[cur].persist ? 1 : 0), 0);

    if (persistedSnacks >= options.maxSnacks) {
      handleClose(activeItemIds[0])();
    }
  };

  // todo: useQueue doesn't get an immediate update to store updates
  const { enqueue, dequeue, remove, activeIds } = useQueue(store, options.maxSnacks, handleFullQueue);

  // todo: dequeue should only happen after transition delay to prevent the notifications from overlapping
  useEffect(dequeue, [store.ids]);

  const handleClose = useCallback(
    (id: SnackId) => () => {
      store.update(id, { open: false });
    },
    []
  );

  const handleExited = useCallback(
    (id: SnackId) => () => {
      remove(id);
    },
    []
  );

  const handleSetHeight = useCallback(
    (id: SnackId) => (height: number) => {
      store.update(id, { height: height });
    },
    []
  );

  const enqueueSnack: SnackContextType['enqueueSnack'] = snack => {
    if (!snack || !snack.message) return null;

    if (options.preventDuplicates) {
      if (store.ids.some(id => store.items[id].message === snack.message)) return null;
    }

    if (snack.id && store.ids.some(id => id === snack.id)) {
      console.warn('Snack with same id has already been enqued', { snack });

      return null;
    }

    // todo: this should be a separate merge-utility
    const mergedSnack: MergedSnack = {
      id: snack.id ?? new Date().getTime() + Math.random(),
      open: true,
      height: 48,
      message: snack.message,
      dynamicHeight: !!snack.dynamicHeight,
      persist: snack.persist ?? options.persist,
      anchorOrigin: snack.anchorOrigin ?? options.anchorOrigin,
      action: snack.action,
    };

    enqueue(mergedSnack);

    return mergedSnack.id;
  };

  const closeSnack: SnackContextType['closeSnack'] = id => {
    handleClose(id)();
  };

  const updateSnackOptions: SnackContextType['updateSnackOptions'] = properties => {
    setOptions(prevOptions => ({ ...prevOptions, ...properties }));
  };

  let enableAutoHide = true;

  return (
    // todo: this should not be a new object on every re-render or we cause the entire tree to re-render
    //       --> think of new strategy to separate context and renderer
    <SnackContext.Provider value={{ closeSnack, enqueueSnack, updateSnack: store.update, updateSnackOptions }}>
      {props.children}

      {activeIds.map((id, index) => {
        const snack = store.items[id];

        const offset = getOffset(index, snack, activeIds, store.items, options.spacing);

        if (enableAutoHide && index > 0 && store.items[activeIds[index - 1]]?.persist) enableAutoHide = false;

        return (
          <SnackItem
            index={index}
            key={snack.id}
            snack={snack}
            offset={offset}
            TransitionComponent={options.TransitionComponent}
            autoHideDuration={enableAutoHide ? options.autoHideDuration : null}
            onClose={handleClose(id)}
            onExited={handleExited(id)}
            onSetHeight={handleSetHeight(id)}
          />
        );
      })}
    </SnackContext.Provider>
  );
};

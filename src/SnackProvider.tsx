import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { SnackContext, SnackContextType } from './contexts/SnackContext';
import { SnackItem } from './SnackItem';
import { useStore } from './hooks/useStore';
import { useQueue } from './hooks/useQueue';
import { MergedSnack, SnackId } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';
import { useOptions } from './hooks/useOptions';
import { getOffset } from './helpers';

interface ComponentProps {
  options?: SnackProviderOptions;
}

export const SnackProvider: FC<ComponentProps> = props => {
  const options = useOptions(props.options);

  const store = useStore<SnackId, MergedSnack>(item => item.id);

  // todo: this is only checked on enqueue if there are multiple peristed items still in queue
  //       they non persisted items will never show
  const handleFullQueue = (activeItemIds: SnackId[]) => {
    const persistedSnacks = activeItemIds.reduce(
      (acc: number, cur) => acc + (store.items[cur].autoHideDuration == undefined ? 1 : 0),
      0
    );

    if (persistedSnacks >= options.maxSnacks) {
      handleClose(activeItemIds[0])();
    }
  };

  const { enque, dequeue, remove, activeIds } = useQueue(store, options.maxSnacks, handleFullQueue);

  // todo: dequeue should only happen after transition delay to prevent the notifications from overlapping
  useEffect(dequeue, [store.ids]);

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
    let computedAutoHideDuration = snack.autoHideDuration;

    if (snack.persist || (snack.persist == undefined && options.persist)) {
      computedAutoHideDuration = undefined;
    } else if (computedAutoHideDuration == undefined) {
      computedAutoHideDuration = options.autoHideDuration;
    }

    const mergedSnack: MergedSnack = {
      id: snack.id ?? new Date().getTime() + Math.random(),
      open: true,
      height: 48,
      message: snack.message,
      dynamicHeight: !!snack.dynamicHeight,
      autoHideDuration: computedAutoHideDuration,
      action: snack.action == undefined ? options.action : snack.action,
    };

    enque(mergedSnack);

    return mergedSnack.id;
  };

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

  const closeSnack: SnackContextType['closeSnack'] = id => {
    handleClose(id)();
  };

  const MemoTransitionComponent = useMemo(() => options.TransitionComponent(options.anchorOrigin), [
    options.anchorOrigin,
  ]);

  let enableAutoHide = true;

  return (
    <SnackContext.Provider value={{ closeSnack, enqueueSnack, updateSnack: store.update }}>
      {props.children}

      {activeIds.map((id, index) => {
        const snack = store.items[id];

        const offset = getOffset(index, activeIds, store.items, options.spacing);

        if (index > 0 && store.items[activeIds[index - 1]]?.autoHideDuration != undefined) enableAutoHide = false;

        return (
          <SnackItem
            index={index}
            key={snack.id}
            anchorOrigin={options.anchorOrigin}
            TransitionComponent={MemoTransitionComponent}
            TransitionProps={options.TransitionProps}
            snack={snack}
            offset={offset}
            enableAutoHide={enableAutoHide}
            onClose={handleClose(id)}
            onExited={handleExited(id)}
            onSetHeight={handleSetHeight(id)}
          />
        );
      })}
    </SnackContext.Provider>
  );
};

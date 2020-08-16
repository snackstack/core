import React, { FC, useCallback } from 'react';
import { defaultTransitionDelay } from './constants';
import { getOffset } from './helpers';
import { useManagerSubscription } from './hooks/useManagerSubscription';
import { SnackItem } from './SnackItem';
import { SnackManager } from './SnackManager';
import { SnackId } from './types/snack';

interface ComponentProps {
  manager: SnackManager;
}

export const SnackRenderer: FC<ComponentProps> = ({ manager }) => {
  const { options, activeIds, items, dequeue, update, close, remove } = useManagerSubscription(manager);

  const handleClose = useCallback((id: SnackId) => () => close(id), [close]);

  const handleExited = useCallback(
    (id: SnackId) => () => {
      remove(id);

      setTimeout(dequeue, defaultTransitionDelay);
    },
    [remove, dequeue]
  );

  const handleSetHeight = useCallback((id: SnackId) => (height: number) => update(id, { height }), [update]);

  let enableAutoHide = true;

  return (
    <>
      {activeIds.map((id, index) => {
        const snack = items[id];

        const offset = getOffset(index, snack, activeIds, items, options.spacing);

        if (enableAutoHide && index > 0) {
          const previousId = activeIds[index - 1];
          const previousItem = items[previousId];

          if (!previousItem.persist) enableAutoHide = false;
        }

        console.log({ id, enableAutoHide, persist: snack.persist });

        return (
          <SnackItem
            index={index}
            key={snack.id}
            snack={snack}
            offset={offset}
            TransitionComponent={options.TransitionComponent}
            autoHideDuration={enableAutoHide && !snack.persist ? options.autoHideDuration : null}
            onClose={handleClose(id)}
            onExited={handleExited(id)}
            onSetHeight={handleSetHeight(id)}
          />
        );
      })}
    </>
  );
};

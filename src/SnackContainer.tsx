import React, { ComponentType, useCallback } from 'react';
import { defaultTransitionDelay } from './constants';
import { getOffset } from './helpers';
import { useManagerSubscription } from './hooks/useManagerSubscription';
import { SnackItem } from './SnackItem';
import { SnackManager } from './SnackManager';
import { Snack } from './types/Snack';
import { SnackRendererProps } from './types/SnackRendererProps';

interface ComponentProps<C extends SnackRendererProps> {
  manager: SnackManager;
  renderer: ComponentType<C>;
  rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
}

export function SnackContainer<C extends SnackRendererProps>(props: ComponentProps<C>) {
  const { options, activeIds, items, dequeue, update, close, remove } = useManagerSubscription(props.manager);

  const handleClose = useCallback((id: Snack['id']) => close(id), [close]);

  const handleExited = useCallback(
    (id: Snack['id']) => {
      remove(id);

      setTimeout(dequeue, defaultTransitionDelay);
    },
    [remove, dequeue]
  );

  const handleSetHeight = useCallback((id: Snack['id'], height: number) => update(id, { height }), [update]);

  let enableAutoHide = true;

  return (
    <>
      {activeIds.map((id, index) => {
        // todo: offset calculation should be part of the renderer
        //       we should only inform the renderer of the height of previous SnackItems
        const offset = getOffset(index, activeIds, items, options.spacing);

        if (enableAutoHide && index > 0) {
          const previousId = activeIds[index - 1];
          const previousItem = items[previousId];

          if (!previousItem.persist) enableAutoHide = false;
        }

        const snack = items[id];

        if (!snack) return null;

        return (
          <SnackItem<C>
            key={snack.id}
            index={index}
            offset={offset}
            snack={snack}
            autoHideDuration={enableAutoHide && !snack.persist ? options.autoHideDuration : null}
            // todo: this will cause unnecessary re-renders
            onClose={() => handleClose(snack.id)}
            onExited={() => handleExited(snack.id)}
            onSetHeight={height => handleSetHeight(snack.id, height)}
            renderer={props.renderer}
            rendererProps={props.rendererProps}
          />
        );
      })}
    </>
  );
}

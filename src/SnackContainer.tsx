import React, { ComponentType, useCallback } from 'react';
import { useManagerSubscription } from './hooks';
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
  const { options, activeIds, items, dequeue, update, remove } = useManagerSubscription(props.manager);

  const handleRemove = useCallback(
    (id: Snack['id']) => {
      remove(id);

      setTimeout(dequeue, options.transitionDelay);
    },
    [remove, dequeue, options.transitionDelay]
  );

  const handleSetHeight = useCallback((id: Snack['id'], height: number) => update(id, { height }), [update]);

  let enableAutoHide = true;
  let heightOffset = 0;

  return (
    <>
      {activeIds.map((id, index) => {
        const snack = items[id];

        if (!snack) return null;

        if (index > 0) {
          const previousId = activeIds[index - 1];
          const previousItem = items[previousId];

          if (previousItem.height) heightOffset += previousItem.height;

          if (enableAutoHide && !previousItem.persist) enableAutoHide = false;
        }

        return (
          <SnackItem<C>
            key={snack.id}
            index={index}
            spacing={options.spacing}
            heightOffset={heightOffset}
            snack={snack}
            autoHideDuration={enableAutoHide && !snack.persist ? options.autoHideDuration : null}
            transitionDelay={options.transitionDelay}
            onRemove={handleRemove}
            onSetHeight={handleSetHeight}
            renderer={props.renderer}
            rendererProps={props.rendererProps}
          />
        );
      })}
    </>
  );
}

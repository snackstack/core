import React, { ComponentType, useCallback } from 'react';
import { useHeightObserver, usePrevious } from './hooks';
import { Snack } from './types/Snack';
import { SnackRendererProps } from './types/SnackRendererProps';

type PickedSnackRendererProps = Omit<SnackRendererProps, 'snackRef' | 'action' | 'onRemove' | 'previousHeightOffset'>;

interface ComponentProps<C extends SnackRendererProps> extends PickedSnackRendererProps {
  snack: Snack;
  // renderer: ComponentType<C>;
  // rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
  onRemove(id: Snack['id']): void;
  onSetHeight(id: Snack['id'], height: number): void;
}

function SnackItemComponent<C extends SnackRendererProps>({
  snack,
  onRemove,
  onSetHeight,
  // rendererProps,
  ...props
}: ComponentProps<C>) {
  const handleRemove = useCallback(() => onRemove(snack.id), [snack.id, onRemove]);
  const handleSetHeight = useCallback((height: number) => onSetHeight(snack.id, height), [snack.id, onSetHeight]);

  const snackRef = useHeightObserver(snack.dynamicHeight, handleSetHeight);
  const previousHeightOffset = usePrevious(props.heightOffset);

  let action = snack.action;
  if (typeof action === 'function') {
    action = action(snack);
  }

  return null;
  // const Renderer = props.renderer as ComponentType<SnackRendererProps>;

  // return (
  //   <Renderer
  //     snack={snack}
  //     snackRef={snackRef}
  //     action={action}
  //     previousHeightOffset={previousHeightOffset}
  //     onRemove={handleRemove}
  //     {...props}
  //     {...rendererProps}
  //   />
  // );
}

/** @internal */
export const SnackItem = React.memo(SnackItemComponent) as typeof SnackItemComponent;

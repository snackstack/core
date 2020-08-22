import React, { ComponentType } from 'react';
import { useHeightObserver } from './hooks';
import { Snack } from './types/Snack';
import { SnackRendererProps } from './types/SnackRendererProps';

type PickedSnackRendererProps = Omit<SnackRendererProps, 'snackRef' | 'action'>;

interface ComponentProps<C extends SnackRendererProps> extends PickedSnackRendererProps {
  snack: Snack;
  renderer: ComponentType<C>;
  rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
  onSetHeight(height: number): void;
}

function SnackItemComponent<C extends SnackRendererProps>({
  snack,
  onSetHeight,
  rendererProps,
  ...props
}: ComponentProps<C>) {
  console.log('render SnackItem', { props });

  const snackRef = useHeightObserver(snack.dynamicHeight, onSetHeight);

  let action = snack.action;
  if (typeof action === 'function') {
    // todo: call action with method that signals closing to the Renderer
    // action = action(snack, props.onClose);
  }

  const Renderer = props.renderer as ComponentType<SnackRendererProps>;

  return <Renderer snack={snack} snackRef={snackRef} action={action} {...props} {...rendererProps} />;
}

export const SnackItem = React.memo(SnackItemComponent) as typeof SnackItemComponent;

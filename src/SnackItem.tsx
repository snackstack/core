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
  const snackRef = useHeightObserver(snack.dynamicHeight, onSetHeight);

  let action = snack.action;
  if (typeof action === 'function') {
    // todo: we need to created a filtered ExposedSnack item here from 'snack'
    //       as to not leak implementation details to the user

    action = action(snack, props.onClose);
  }

  const Renderer = props.renderer as ComponentType<SnackRendererProps>;

  return <Renderer snack={snack} snackRef={snackRef} action={action} {...props} {...rendererProps} />;
}

export const SnackItem = React.memo(SnackItemComponent) as typeof SnackItemComponent;

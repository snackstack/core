import React, { ComponentType } from 'react';
import { useHeightObserver, usePrevious } from './hooks';
import { Snack } from './types/Snack';
import { SnackRendererProps } from './types/SnackRendererProps';

type PickedSnackRendererProps = Omit<SnackRendererProps, 'snackRef' | 'previousOffset' | 'action'>;

interface ComponentProps<C extends SnackRendererProps> extends PickedSnackRendererProps {
  snack: Snack;
  renderer: ComponentType<C>;
  rendererProps?: Partial<Omit<C, keyof SnackRendererProps>>;
  onSetHeight(height: number): void;
}

function SnackItemComponent<C extends SnackRendererProps>({ snack, ...props }: ComponentProps<C>) {
  const snackRef = useHeightObserver(snack.dynamicHeight, props.onSetHeight);
  const previousOffset = usePrevious(props.offset);

  let action = snack.action;
  if (typeof action === 'function') {
    // todo: we need to created a filtered ExposedSnack item here from 'snack'
    //       as to not leak implementation details to the user

    action = action(snack, props.onClose);
  }

  const Renderer = props.renderer as ComponentType<SnackRendererProps>;

  return (
    <Renderer
      index={props.index}
      offset={props.offset}
      previousOffset={previousOffset}
      snack={snack}
      snackRef={snackRef}
      action={action}
      autoHideDuration={props.autoHideDuration}
      onClose={props.onClose}
      onExited={props.onExited}
      {...props.rendererProps}
    />
  );
}

export const SnackItem = React.memo(SnackItemComponent) as typeof SnackItemComponent;

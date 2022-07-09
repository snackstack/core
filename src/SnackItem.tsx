import React, { FC, PropsWithChildren, useCallback } from 'react';
import { useSnackManager, useHeightObserver } from './hooks';
import { Snack } from './types';

type Props = PropsWithChildren<{ snackId: Snack['id'] }>;

export const SnackItem: FC<Props> = ({ children, snackId }) => {
  const manager = useSnackManager();
  const handleHeightChanged = useCallback(
    (newHeight: number) => {
      manager.update(snackId, { height: newHeight });
    },
    [snackId]
  );

  const snackRef = useHeightObserver(handleHeightChanged);

  const onlyChild = React.Children.only(children);
  // @ts-ignore
  const clonedChild = React.cloneElement(onlyChild, { ref: snackRef });

  return clonedChild;
};

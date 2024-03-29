import React, { FC, useCallback } from 'react';
import { useSnackManager, useHeightObserver } from './hooks';
import { Snack } from './types';

export type SnackItemProps = { snackId: Snack['id']; children: React.ReactElement };

export const SnackItem: FC<SnackItemProps> = ({ children, snackId }) => {
  const manager = useSnackManager();
  const handleHeightChanged = useCallback(
    (newHeight: number) => {
      manager.update(snackId, { height: newHeight });
    },
    [snackId, manager]
  );

  const snackRef = useHeightObserver(handleHeightChanged);

  const onlyChild = React.Children.only(children);
  const clonedChild = React.cloneElement(onlyChild, { ref: snackRef });

  return clonedChild;
};

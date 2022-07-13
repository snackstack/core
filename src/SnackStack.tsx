import React, { FC, JSXElementConstructor, useCallback } from 'react';
import { useActiveSnacks, useSnackManager } from './hooks';
import { SnackProps } from './Snack';
import { SnackItem } from './SnackItem';
import { Snack } from './types';

const defaultSpacing = 8;
const defaultBorderDistance = 20;

type SnackComponent = JSXElementConstructor<SnackProps>;

export type SnackStackProps = {
  Component: SnackComponent;
  spacing?: number;
  borderDistance?: number;
};

export const SnackStack: FC<SnackStackProps> = ({
  Component,
  spacing = defaultSpacing,
  borderDistance = defaultBorderDistance,
}) => {
  const activeSnacks = useActiveSnacks();

  let offset = borderDistance;
  let previousSnack: Snack | null = null;
  let hasActiveSnack = false;

  return (
    <>
      {activeSnacks.map((snack, index) => {
        let isActive = false;

        if (index > 0) {
          offset += (previousSnack?.height ?? 0) + spacing;
        }

        if (!hasActiveSnack && !snack.persist) {
          isActive = true;
          hasActiveSnack = true;
        }

        previousSnack = snack;

        return <InnerSnack snack={snack} isActive={isActive} offset={offset} Component={Component} />;
      })}
    </>
  );
};

/** @internal */
type InnerSnackProps = {
  snack: Snack;
  isActive: boolean;
  offset: number;
  Component: SnackComponent;
};

/** @internal */
const InnerSnack: FC<InnerSnackProps> = ({ snack, isActive, offset, Component }) => {
  const manager = useSnackManager();

  const snackId = snack.id;

  let message = snack.message;

  if (typeof message === 'function') {
    message = message(snack);
  }

  let action = snack.action;

  if (typeof action === 'function') {
    action = action(snack);
  }

  const onClose = useCallback(() => {
    manager.close(snackId);
  }, [snackId, manager]);

  const onExited = useCallback(() => {
    manager.remove(snackId);
  }, [snackId, manager]);

  return (
    <SnackItem key={snack.id} snackId={snack.id}>
      <Component
        snackId={snackId}
        isActive={isActive}
        offset={offset}
        message={message}
        action={action}
        persist={snack.persist}
        status={snack.status}
        variant={snack.variant}
        meta={snack.meta}
        onClose={onClose}
        onExited={onExited}
      />
    </SnackItem>
  );
};

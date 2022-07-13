import { ReactNode } from 'react';
import { Snack } from './types';

export type SnackProps = Readonly<
  Omit<Snack, 'id'> & {
    snackId: Snack['id'];
    isActive: boolean;
    offset: number;
    message: ReactNode;
    action: ReactNode;
    onClose(): void;
    onExited(): void;
  }
>;

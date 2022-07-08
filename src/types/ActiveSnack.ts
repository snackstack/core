import { ReactNode } from 'react';
import { Snack } from './Snack';

export type ActiveSnack = Snack & {
  action: ReactNode;
  index: number;
};

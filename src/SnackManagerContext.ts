import { createContext } from 'react';
import { SnackManager } from './SnackManager';

/** @internal */
export const SnackManagerContext = createContext<SnackManager>(null!);
SnackManagerContext.displayName = 'SnackManagerContext';

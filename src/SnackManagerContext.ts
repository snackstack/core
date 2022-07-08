import { createContext } from 'react';
import { ISnackManager } from './SnackManager';

/** @internal */
export const SnackManagerContext = createContext<ISnackManager>(null!);
SnackManagerContext.displayName = 'SnackManagerContext';

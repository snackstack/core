import { createContext } from 'react';
import { SnackManager } from 'SnackManager';

type ContextType = Pick<SnackManager, 'enqueue' | 'update' | 'close'>;

/** @internal */
export const SnackManagerContext = createContext<ContextType>(null!);
SnackManagerContext.displayName = 'SnackManagerContext';

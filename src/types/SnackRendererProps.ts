import { Snack } from './Snack';

export interface SnackRendererProps {
  index: number;
  offset: number;
  previousOffset: number;
  snack: Omit<Snack, 'action'>;
  snackRef: React.MutableRefObject<HTMLElement | undefined>;
  action: React.ReactNode;
  autoHideDuration: number | null;
  onClose(): void;
  onExited(): void;
}

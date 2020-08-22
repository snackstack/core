import { Snack } from './Snack';

export interface SnackRendererProps {
  index: number;
  heightOffset: number;
  spacing: number;
  snack: Omit<Snack, 'action'>;
  snackRef: React.MutableRefObject<HTMLElement | undefined>;
  action: React.ReactNode;
  autoHideDuration: number | null;
  onExited(): void;
}

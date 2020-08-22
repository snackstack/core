import { Snack } from './Snack';

export interface SnackRendererProps {
  index: number;
  heightOffset: number;
  spacing: number;
  snack: Omit<Snack, 'action'>;
  snackRef: React.RefObject<HTMLElement>;
  action: React.ReactNode;
  autoHideDuration: number | null;
  onRemove(): void;
}

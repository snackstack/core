import { Snack } from './Snack';

export interface SnackRendererProps {
  index: number;
  offset: number;
  previousOffset: number;
  snack: Omit<Snack, 'action'>;
  snackRef: React.MutableRefObject<HTMLElement | undefined>;
  action: React.ReactNode;
  autoHideDuration: number | null;
  hideIcon: boolean;
  onSetHeight(id: Snack['id'], height: number): void;
  onClose(id: Snack['id']): void;
  onExited(id: Snack['id']): void;
}

type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

export interface Snack {
  readonly id: string | number;
  dynamicHeight: boolean;
  persist: boolean;
  message: React.ReactNode;
  action?: React.ReactNode | ((snack: this) => React.ReactNode);
  variant: SnackVariant;
  open: boolean;
  height?: number;
}

export type SnackPayload = Partial<Omit<Snack, 'id' | 'height' | 'open'>> & {
  id?: Snack['id'];
};

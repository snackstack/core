type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

export interface Snack {
  readonly id: string | number;
  message: React.ReactNode;
  variant: SnackVariant;
  persist: boolean;
  open: boolean;
  action?: React.ReactNode | ((snack: this) => React.ReactNode);
  meta?: Record<string, any>;
}

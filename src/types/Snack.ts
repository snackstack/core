type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

export interface Snack {
  readonly id: string | number;
  message: React.ReactNode;
  variant: SnackVariant;
  persist: boolean;
  dynamicHeight: boolean;
  open: boolean;
  height?: number;
  action?: React.ReactNode | ((snack: this) => React.ReactNode);
  meta?: Record<string, any>;
}

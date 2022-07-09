type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

export type Snack = {
  readonly id: string | number;
  message: React.ReactNode;
  readonly variant: SnackVariant;
  persist: boolean;
  open: boolean;
  action?: React.ReactNode | ((snack: Snack) => React.ReactNode);
  readonly meta?: Record<string, any>;
};

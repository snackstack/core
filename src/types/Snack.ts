type SnackVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

type SnackStatus = 'open' | 'closing' | 'inactive';

export type Snack = {
  readonly id: string | number;
  message: React.ReactNode | ((snack: Snack) => React.ReactNode);
  readonly variant: SnackVariant;
  persist: boolean;
  status: SnackStatus;
  action?: React.ReactNode | ((snack: Snack) => React.ReactNode);
  readonly meta?: Record<string, any>;
};

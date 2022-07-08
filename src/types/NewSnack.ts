import { Snack } from './Snack';

export type NewSnack = Partial<Omit<Snack, 'height' | 'open'>>;

import { getDefaultOptions, createSnack } from './helpers';
import { Snack, NewSnack, SnackProviderOptions } from './types';

type Listener = () => void;

type SnackUpdate = Partial<Omit<Snack, 'id' | 'open' | 'meta' | 'variant'>>;

export interface ISnackManager {
  enqueue(input: NewSnack | string): Snack['id'] | null;
  update(id: Snack['id'], properties: SnackUpdate): void;
  close(id: Snack['id']): void;
  remove(id: Snack['id']): void;
}

/** @internal */
export class SnackManager implements ISnackManager {
  private readonly options: Required<SnackProviderOptions>;
  private readonly snacks = new Map<Snack['id'], Snack>();
  private readonly snackIds: Snack['id'][] = [];
  private readonly activeSnacks: Snack[] = [];
  private readonly listeners = new Set<Listener>();

  constructor(options?: SnackProviderOptions) {
    this.options = getDefaultOptions(options);
  }

  enqueue = (input: NewSnack | string): Snack['id'] | null => {
    if (!input) {
      return null;
    }

    let payload: NewSnack;

    if (typeof input === 'string') {
      payload = { message: input };
    } else {
      if (!input.message) {
        return null;
      }

      payload = input;
    }

    if (payload.id && this.snacks.has(payload.id)) {
      return null;
    }

    if (this.options.preventDuplicates) {
      if (this.snackIds.some(id => this.snacks.get(id)!.message === payload.message)) {
        return null;
      }
    }

    const snack = createSnack(payload, this.options);

    this.snackIds.push(snack.id);
    this.snacks.set(snack.id, snack);

    this.dequeue();

    return snack.id;
  };

  update = (id: Snack['id'], properties: Partial<Snack>) => {
    const snack = this.snacks.get(id);

    if (!snack) {
      return;
    }

    this.snacks.set(id, { ...snack, ...properties });

    this.processUpdate();
  };

  close = (id: Snack['id']) => {
    this.update(id, { status: 'closing' });
  };

  remove = (id: Snack['id']) => {
    const activeIndex = this.activeSnacks.findIndex(s => s.id === id);

    if (activeIndex > -1) {
      this.activeSnacks.splice(activeIndex, 1);
    }

    const index = this.snackIds.indexOf(id);

    if (index > -1) {
      this.snackIds.splice(index, 1);
    }

    this.snacks.delete(id);

    this.processUpdate();
  };

  subscribe = (listener: Listener) => {
    console.log('subscribe');

    this.listeners.add(listener);

    return () => {
      console.log('unsubscribe');
      this.listeners.delete(listener);
    };
  };

  getState = () => {
    console.log('getState');

    return this.activeSnacks;
  };

  private dequeue = () => {
    if (this.snacks.size < 1) {
      return;
    }

    if (this.activeSnacks.length >= this.options.maxSnacks) {
      const persistedNum = this.activeSnacks.reduce<number>((num, snack) => num + (snack.persist ? 1 : 0), 0);

      if (persistedNum === this.activeSnacks.length) {
        const [firstSnack] = this.activeSnacks;

        this.close(firstSnack.id);
      } else {
        return;
      }
    }

    const nextId = this.snackIds[this.activeSnacks.length];

    if (!nextId) {
      return;
    }

    const nextSnack = this.snacks.get(nextId)!;

    this.activeSnacks.push(nextSnack);

    this.update(nextId, { status: 'open' });
  };

  private processUpdate = () => {
    console.log('processUpdate');

    this.listeners.forEach(listener => listener());
  };
}

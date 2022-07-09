import { getDefaultOptions, createSnack } from './helpers';
import { Snack, NewSnack, SnackProviderOptions } from './types';

type KeyedSnacks = { [key in Snack['id']]: Snack };
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
  private readonly ids: Snack['id'][] = [];
  private readonly items: KeyedSnacks = {};
  private readonly activeIds: Snack['id'][] = [];
  private readonly listeners = new Set<Listener>();
  private _activeSnackCache: Snack[] = [];

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

    if (payload.id && this.ids.some(id => id === payload.id)) {
      return null;
    }

    if (this.options.preventDuplicates) {
      if (this.ids.some(id => this.items[id].message === payload.message)) {
        return null;
      }
    }

    const snack = createSnack(payload, this.options);

    this.items[snack.id] = snack;
    this.ids.push(snack.id);

    this.dequeue();

    return snack.id;
  };

  update = (id: Snack['id'], properties: Partial<Snack>) => {
    if (!this.items[id]) {
      return;
    }

    this.items[id] = { ...this.items[id], ...properties };

    this.notifyListeners();
  };

  close = (id: Snack['id']) => {
    this.update(id, { status: 'closing' });
  };

  remove = (id: Snack['id']) => {
    const activeIndex = this.ids.indexOf(id);

    if (activeIndex > -1) {
      this.activeIds.splice(activeIndex, 1);
    }

    const idIndex = this.ids.indexOf(id);

    if (idIndex > -1) {
      this.ids.splice(idIndex, 1);
    }

    delete this.items[id];

    this.notifyListeners();
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

    return this._activeSnackCache;
  };

  private dequeue = () => {
    if (this.ids.length < 1) {
      return;
    }

    if (this.activeIds.length >= this.options.maxSnacks) {
      const persitedItems = this.activeIds.reduce((acc: number, cur) => acc + (this.items[cur].persist ? 1 : 0), 0);

      if (persitedItems === this.activeIds.length) {
        const [firstPeristedId] = this.activeIds;

        this.close(firstPeristedId);
      }

      return;
    }

    const nextId = this.ids[this.activeIds.length];

    if (!nextId) {
      return;
    }

    this.items[nextId].status = 'open';

    this.activeIds.push(nextId);

    this.notifyListeners();
  };

  private notifyListeners = () => {
    console.log('notify listeners');

    this._activeSnackCache = this.activeIds.map(id => this.items[id]);

    this.listeners.forEach(listener => listener());
  };
}

import { getDefaultOptions, createSnack } from './helpers';
import { Snack, NewSnack, SnackManagerOptions, SnackUpdate } from './types';

type Callback = () => void;

type Options = Readonly<Required<SnackManagerOptions>>;

export class SnackManager {
  private readonly options: Options;
  private readonly snacks = new Map<Snack['id'], Snack>();
  private readonly snackIds: Snack['id'][] = [];
  private readonly activeSnackIds: Snack['id'][] = [];
  private readonly listeners = new Set<Callback>();

  constructor(options?: SnackManagerOptions) {
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

  update = (id: Snack['id'], properties: SnackUpdate): void => {
    const snack = this.snacks.get(id);

    if (!snack) {
      return;
    }

    this.snacks.set(id, { ...snack, ...properties });

    this.processUpdate();
  };

  close = (id: Snack['id']): void => {
    const update: Partial<Snack> = { status: 'closing' };

    this.update(id, update);
  };

  remove = (id: Snack['id']): void => {
    const activeIndex = this.activeSnackIds.indexOf(id);

    if (activeIndex > -1) {
      this.activeSnackIds.splice(activeIndex, 1);
    }

    const index = this.snackIds.indexOf(id);

    if (index > -1) {
      this.snackIds.splice(index, 1);
    }

    this.snacks.delete(id);

    this.processUpdate();
  };

  subscribe = (listener: Callback): Callback => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  private _activeSnackCache: Snack[] = [];

  getActiveSnacks = (): Snack[] => {
    return this._activeSnackCache;
  };

  getOptions = (): Options => {
    return this.options;
  };

  private dequeue = () => {
    if (this.snacks.size < 1) {
      return;
    }

    if (this.activeSnackIds.length >= this.options.maxSnacks) {
      const persistedNum = this.activeSnackIds.reduce<number>(
        (num, id) => num + (this.snacks.get(id)!.persist ? 1 : 0),
        0
      );

      if (persistedNum === this.activeSnackIds.length) {
        const [firstSnackId] = this.activeSnackIds;

        this.close(firstSnackId);
      } else {
        return;
      }
    }

    const nextId = this.snackIds[this.activeSnackIds.length];

    if (!nextId) {
      return;
    }

    this.activeSnackIds.push(nextId);

    const update: Partial<Snack> = { status: 'open' };

    this.update(nextId, update);
  };

  private processUpdate = () => {
    this._activeSnackCache = this.activeSnackIds.map(id => this.snacks.get(id)!);

    this.listeners.forEach(listener => listener());
  };
}

import { getDefaultOptions, getSnack } from './helpers';
import { UpdateProviderOptionsArgs } from './SnackContext';
import { Snack, SnackPayload } from './types/Snack';
import { SnackProviderOptions } from './types/SnackProviderOptions';

export type KeyedSnacks = { [key in Snack['id']]: Snack };

export class SnackManager {
  options: SnackProviderOptions;
  ids: Snack['id'][];
  items: KeyedSnacks;
  activeIds: Snack['id'][];

  constructor(options?: Partial<SnackProviderOptions>) {
    this.options = getDefaultOptions(options);

    this.items = {};
    this.ids = [];
    this.activeIds = [];

    this.enqueue = this.enqueue.bind(this);
    this.dequeue = this.dequeue.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
  }

  enqueue(input: SnackPayload | string): Snack['id'] | null {
    if (!input) return null;

    let payload: SnackPayload;

    if (typeof input === 'string') payload = { message: input };
    else {
      if (!input.message) return null;

      payload = input;
    }

    if (this.options.preventDuplicates) {
      if (this.ids.some(id => this.items[id].message === payload.message)) return null;
    }

    if (payload.id && this.ids.some(id => id === payload.id)) return null;

    const snack = getSnack(payload, this.options);

    this.items[snack.id] = snack;
    this.ids.push(snack.id);

    this.dequeue();

    return snack.id;
  }

  dequeue() {
    if (this.ids.length < 1) return;

    if (this.activeIds.length >= this.options.maxSnacks) {
      const persitedItems = this.activeIds.reduce((acc: number, cur) => acc + (this.items[cur].persist ? 1 : 0), 0);

      if (persitedItems === this.activeIds.length) {
        const [firstPeristedId] = this.activeIds;

        this.update(firstPeristedId, { open: false });
      }

      return;
    }

    const nextId = this.ids[this.activeIds.length];

    if (!nextId) return;

    this.activeIds.push(nextId);

    this.notifySubscribers();
  }

  update(id: Snack['id'], properties: Partial<Snack>) {
    if (!this.items[id]) return;

    this.items[id] = { ...this.items[id], ...properties };

    this.notifySubscribers();
  }

  remove(id: Snack['id']) {
    const activeIndex = this.ids.indexOf(id);

    if (activeIndex > -1) this.activeIds.splice(activeIndex, 1);

    const idIndex = this.ids.indexOf(id);

    if (idIndex > -1) this.ids.splice(idIndex, 1);

    delete this.items[id];

    this.notifySubscribers();
  }

  updateOptions(properties: UpdateProviderOptionsArgs) {
    let newProperties: Partial<SnackProviderOptions>;

    if (typeof properties === 'function') newProperties = properties(this.options);
    else newProperties = properties;

    this.options = { ...this.options, ...newProperties };

    this.notifySubscribers();
  }

  private notifySubscribers() {
    if (this.rerenderSubscribers) this.rerenderSubscribers();
  }

  rerenderSubscribers?: () => void;
}

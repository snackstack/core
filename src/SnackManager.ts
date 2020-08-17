import { getDefaultOptions } from './helpers';
import { UpdateProviderOptionsArgs } from './SnackContext';
import { Snack, SnackPayload } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';

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
    this.close = this.close.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
  }

  enqueue(payload: SnackPayload | string): Snack['id'] | null {
    if (!payload) return null;

    let partialSnack: SnackPayload;

    if (typeof payload === 'string') partialSnack = { message: payload };
    else {
      if (!payload.message) return null;

      partialSnack = payload;
    }

    if (this.options.preventDuplicates) {
      if (this.ids.some(id => this.items[id].message === partialSnack.message)) return null;
    }

    if (partialSnack.id && this.ids.some(id => id === partialSnack.id)) {
      console.warn('Snack with same id has already been enqued', { snack: payload });

      return null;
    }

    // todo: this should be a separate merge-utility
    const snack: Snack = {
      id: partialSnack.id ?? new Date().getTime() + Math.random(),
      open: true,
      height: 48,
      message: partialSnack.message,
      dynamicHeight: !!partialSnack.dynamicHeight,
      persist: partialSnack.persist ?? this.options.persist,
      anchorOrigin: partialSnack.anchorOrigin ?? this.options.anchorOrigin,
      action: partialSnack.action,
      variant: partialSnack.variant ?? 'default',
    };

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

        this.close(firstPeristedId);
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

  close(id: Snack['id']) {
    if (!this.activeIds.some(i => i === id)) this.remove(id);
    else this.update(id, { open: false });
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

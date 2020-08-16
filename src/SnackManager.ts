import { getDefaultOptions } from './helpers';
import { UpdateProviderOptionsArgs } from './SnackContext';
import { MergedSnack, Snack, SnackId } from './types/snack';
import { SnackProviderOptions } from './types/snackProviderOptions';

export type KeyedSnacks = { [key in SnackId]: MergedSnack };

export class SnackManager {
  options: SnackProviderOptions;
  ids: SnackId[];
  items: KeyedSnacks;
  activeIds: SnackId[];

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

  enqueue(input: Snack | string): SnackId | null {
    if (!input) return null;

    let inputSnack: Snack;

    if (typeof input === 'string') inputSnack = { message: input };
    else {
      if (!input.message) return null;

      inputSnack = input;
    }

    if (this.options.preventDuplicates) {
      if (this.ids.some(id => this.items[id].message === inputSnack.message)) return null;
    }

    if (inputSnack.id && this.ids.some(id => id === inputSnack.id)) {
      console.warn('Snack with same id has already been enqued', { snack: input });

      return null;
    }

    // todo: this should be a separate merge-utility
    const snack: MergedSnack = {
      id: inputSnack.id ?? new Date().getTime() + Math.random(),
      open: true,
      height: 48,
      message: inputSnack.message,
      dynamicHeight: !!inputSnack.dynamicHeight,
      persist: inputSnack.persist ?? this.options.persist,
      anchorOrigin: inputSnack.anchorOrigin ?? this.options.anchorOrigin,
      action: inputSnack.action,
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

  update(id: SnackId, properties: Partial<MergedSnack>) {
    if (!this.items[id]) return;

    this.items[id] = { ...this.items[id], ...properties };

    this.notifySubscribers();
  }

  remove(id: SnackId) {
    const activeIndex = this.ids.indexOf(id);

    if (activeIndex > -1) this.activeIds.splice(activeIndex, 1);

    const idIndex = this.ids.indexOf(id);

    if (idIndex > -1) this.ids.splice(idIndex, 1);

    delete this.items[id];

    this.notifySubscribers();
  }

  close(id: SnackId) {
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

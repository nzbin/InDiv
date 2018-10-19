import { TFnWatcher } from '../types';

import Utils from '../utils';

const utils = new Utils();

/**
 * watch a key of an Object
 *
 * @class KeyWatcher
 */
class KeyWatcher {
  public data: any;
  public watcher?: TFnWatcher;
  public key: string;

  constructor(data: any, key: string, watcher?: TFnWatcher) {
    this.data = data;
    this.key = key;
    this.watcher = watcher;
    this.watchData(this.data, this.key);
  }

  public watchData(data: any, key: string): void {
    if (!data || typeof data !== 'object' || !data[key]) return;
    const vm = this;
    let val = data[key];
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        return val;
      },
      set(newVal: any) {
        if (utils.isEqual(newVal, val)) return;

        let oldData;
        if (vm.watcher) {
          if (typeof val === 'object') oldData = JSON.parse(JSON.stringify(val));
          if (typeof val !== 'object' && typeof val !== 'function') oldData = val;
        }

        val = newVal;

        if (vm.watcher) vm.watcher(oldData);
      },
    });
  }
}

export default KeyWatcher;

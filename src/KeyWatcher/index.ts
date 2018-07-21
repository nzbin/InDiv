import { IKeyWatcher, IFnWatcher, IUtils } from './types';

import Utils from '../Utils';

class KeyWatcher implements IKeyWatcher {
  data: any;
  watcher?: IFnWatcher;
  key: string;
  utils: IUtils;

  constructor(data: any, key: string, watcher?: IFnWatcher) {
    this.data = data;
    this.key = key;
    this.watcher = watcher;
    this.watchData(this.data, this.key);
    this.utils = new Utils();
  }

  watchData(data: any, key: string): void {
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
        if (vm.utils.isEqual(newVal, val)) return;
        if (newVal === val) return;
        const oldData: any = {};
        oldData[key] = val;
        const newData: any = {};
        newData[key] = newVal;
        val = newVal;
        if (vm.watcher) vm.watcher(oldData, newData);
      },
    });
  }
}

export default KeyWatcher;

import { TFnWatcher, TFnRender } from '../types';

import { Utils } from '../utils';

const utils = new Utils();

/**
 * Watcher for InDiv
 *
 * @class Watcher
 */
export class Watcher {
  private data: any;
  private watcher: TFnWatcher;
  private render: TFnRender;

  /**
   * Creates an instance of Watcher.
   * 
   * data: watched data
   * watcher: function for data change
   * render: InDiv render
   * 
   * @param {*} data
   * @param {TFnWatcher} [watcher]
   * @param {TFnRender} [render]
   * @memberof Watcher
   */
  constructor(
    data: any,
    watcher?: TFnWatcher,
    render?: TFnRender,
  ) {
    this.data = data;
    this.watcher = watcher;
    this.render = render;
    this.watchData(this.data);
  }

  private watchData(data: any): void {
    if (!data || typeof data !== 'object') return;
    const vm = this;
    for (const key in data) {
      let val = data[key];
      vm.watchData(val);
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
          return val;
        },
        set(newVal: any) {
          if (utils.isEqual(newVal, val)) return;

          // for watcher method
          let oldData;
          if (vm.watcher) oldData = JSON.parse(JSON.stringify(vm.data));

          val = newVal;
          vm.watchData(val);
          if (vm.watcher) vm.watcher(oldData);
          if (vm.render) vm.render();
        },
      });
    }
  }
}

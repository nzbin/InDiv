import { TFnWatcher, TFnRender } from '../types';
import Utils from '../Utils';
class Watcher {
  public data: any;
  public watcher: TFnWatcher;
  public render: TFnRender;
  public utils: Utils;

  constructor(
    data: any,
    watcher?: TFnWatcher,
    render?: TFnRender,
  ) {
    this.data = data;
    this.watcher = watcher;
    this.render = render;
    this.watchData(this.data);
    this.utils = new Utils();
  }

  public watchData(data: any): void {
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
          if (vm.utils.isEqual(newVal, val)) return;
          const oldData = JSON.parse(JSON.stringify(vm.data));
          const newData: any = {};
          newData[key] = newVal;
          val = newVal;
          vm.watchData(val);
          if (vm.watcher) {
            vm.watcher(oldData, vm.data);
          }
          if (vm.render) vm.render();
        },
      });
    }
  }
}

export default Watcher;

const Utils = require('./Utils');

class KeyWatcher {
  constructor(data, key, watcher) {
    this.data = data;
    this.watcher = watcher;
    this.key = key;
    this.watchData(this.data, this.key);
    this.utils = new Utils();
  }

  watchData(data, key) {
    if (!data || typeof data !== 'object' || !data[key]) return;
    const vm = this;
    let val = data[key];
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: false,
      get() {
        return val;
      },
      set(newVal) {
        if (vm.utils.isEqual(newVal, val)) return;
        if (newVal === val) return;
        const oldData = {};
        oldData[key] = val;
        const newData = {};
        newData[key] = newVal;
        val = newVal;
        if (vm.watcher) vm.watcher(oldData, newData);
      },
    });
  }
}

module.exports = KeyWatcher;

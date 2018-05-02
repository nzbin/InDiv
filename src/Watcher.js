class Watcher {
  constructor(data, watcher, updater, render) {
    this.data = data;
    this.watcher = watcher;
    this.updater = updater;
    this.render = render;
    this.watchData(this.data);
  }

  watchData(data) {
    if (!data || typeof data !== 'object') return;
    const that = this;
    for (let key in data) {
      let val = data[key];
      that.watchData(val);
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: false,
        get() {
          return val;
        },
        set(newVal) {
          if (newVal instanceof Object) {
            if (newVal === val || JSON.stringify(newVal) === JSON.stringify(val)) return;
          }
          if (newVal === val) return;
          const oldData = {};
          oldData[key] = val;
          const newData = {};
          newData[key] = newVal;
          val = newVal;
          that.watchData(val);
          if (that.watcher) that.watcher(oldData, newData);
          if (that.updater) that.updater(key, newVal);
          if (that.render) that.render();
        },
      });
    }
  }
}

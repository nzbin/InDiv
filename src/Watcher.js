class Watcher {
  constructor(data, callback, render) {
    this.data = data;
    this.callback = callback;
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
          if (newVal === val) return;
          const oldData = {};
          oldData[key] = val;
          const newData = {};
          newData[key] = newVal;
          if (that.callback) that.callback(oldData, newData);
          if (that.render) that.render();
          val = newVal;
          that.watchData(val);
        },
      });
    }
  }
}

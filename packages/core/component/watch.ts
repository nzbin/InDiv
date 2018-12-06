import { Utils } from '../utils';

export type TFnWatcher = (oldData?: any) => void;
export type TFnRender = () => any;

const utils = new Utils();

export function watchData(data: any, watcher?: TFnWatcher, render?: TFnRender) {
  if (!data || typeof data !== 'object') return;
  for (const key in data) {
      let val = data[key];
      watchData(val, watcher, render);
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
          if (watcher) oldData = JSON.parse(JSON.stringify(data));

          val = newVal;
          watchData(val, watcher, render);
          if (watcher) watcher(oldData);
          if (render) render();
        },
      });
    }
}

export function watchDataByKey(data: any, key: string, watcher?: TFnWatcher, render?: TFnRender): void {
  if (!data || typeof data !== 'object' || !(data as Object).hasOwnProperty(key)) return;
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
      if (watcher) {
        if (typeof val === 'object') oldData = JSON.parse(JSON.stringify(val));
        if (typeof val !== 'object' && typeof val !== 'function') oldData = val;
      }

      val = newVal;
      
      if (watcher) watcher(oldData);
      if (render) render();
    },
  });
}

// todo 有点问题
export function Watcher (target: any, propertyName: string) {
  console.log(323001123123123, target, propertyName);
  const val = (target as any)[propertyName];

  if (target.nvWatchState) {
    watchDataByKey(target, propertyName, target.nvWatchState.bind(target), target.render.bind(target));
    watchData(val, target.nvWatchState.bind(target), target.render.bind(target));
  }
  if (!target.nvWatchState) {
    watchDataByKey(target, propertyName, null, target.render.bind(target));
    watchData(val, null, target.render.bind(target));
  }

  if (target.dependencesList.indexOf(propertyName) === -1) target.dependencesList.push(propertyName);
}

export function Watch() {
  return Watcher;
}

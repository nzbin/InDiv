import { Utils } from '../utils';

export type TFnWatcher = (oldData?: any) => void;
export type TFnRender = () => any;

const utils = new Utils();

/**
 * Recursive watch data by Object.defineProperty
 * 
 * when watch data has been changed, will call watcher and render
 * but new property can't be watched, you can use setState
 *
 * @export
 * @param {*} data
 * @param {TFnWatcher} [watcher]
 * @param {TFnRender} [render]
 * @returns
 */
export function watchData(data: any, propertyName: string, target: any, watcher?: TFnWatcher, render?: TFnRender) {
  if (!data || typeof data !== 'object') return;
  for (const key in data) {
      let val = data[key];
      watchData(val, propertyName, target, watcher, render);
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
          return val;
        },
        set(newVal: any) {
          if (utils.isEqual(newVal, val)) return;

          val = newVal;
          watchData(val, propertyName, target, watcher, render);

          if (watcher && target.renderStatus === 'available') {
            const oldVal: any = {};
            oldVal[propertyName] = JSON.parse(JSON.stringify(target[propertyName]));
            watcher(oldVal);
          }
          if (render && target.renderStatus === 'available') render();
        },
      });
    }
}

/**
 * watch data's one propertyName by Object.defineProperty
 * 
 * when watch data has been changed, will call watcher and render
 * but new property can't be watched, you can use setState
 * and it will only watch one propertyName and don't recursive watch children
 *
 * @export
 * @param {*} data
 * @param {string} propertyName
 * @param {TFnWatcher} [watcher]
 * @param {TFnRender} [render]
 * @returns {void}
 */
export function watchDataByKey(target: any, propertyName: string, watcher?: TFnWatcher, render?: TFnRender): void {
  if (!target || typeof target !== 'object' || !(target as Object).hasOwnProperty(propertyName)) return;
  let data = target[propertyName];
  Object.defineProperty(target, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      return data;
    },
    set(newValue: any) {
      if (utils.isEqual(newValue, data)) return;

      if (watcher && target.renderStatus === 'available') {
        const oldVal: any = {};
        oldVal[propertyName] = JSON.parse(JSON.stringify(data));
        watcher(oldVal);
      }

      data = newValue;
      if (render && target.renderStatus === 'available') render();
    },
  });
}

/**
 * recursive watch dependens in target
 *
 * @export
 * @param {*} target
 * @param {string} propertyName
 */
export function WatcherDependences (target: any, propertyName: string) {
  const data = (target as any)[propertyName];

  if (!target.render) throw new Error(`function WatcherDependences can only be used in @Component!`);

  if (target.nvWatchState) {
    watchDataByKey(target, propertyName, target.nvWatchState.bind(target), target.render.bind(target));
    watchData(data, propertyName, target, target.nvWatchState.bind(target), target.render.bind(target));
  }
  if (!target.nvWatchState) {
    watchDataByKey(target, propertyName, null, target.render.bind(target));
    watchData(data, propertyName, target, null, target.render.bind(target));
  }
  if (target.dependencesList && target.dependencesList.indexOf(propertyName) === -1) target.dependencesList.push(propertyName);
  if (!target.dependencesList) target.dependencesList = [ propertyName ];
}

/**
 * Decorator @Watch in @Component
 * 
 * add watch property in prototype chain of instance
 *
 * @export
 * @returns
 */
export function Watch() {
  return function (target: any, propertyName: string) {
    if (target.dependencesList && target.dependencesList.indexOf(propertyName) === -1) target.dependencesList.push(propertyName);
    if (!target.dependencesList) target.dependencesList = [ propertyName ];
  };
}

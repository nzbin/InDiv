import { IComponent } from '../types';
export declare type TFnWatcher = (oldData?: any) => void;
export declare type TFnRender = () => any;
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
export declare function watchData(data: any, propertyName: string, target: IComponent, watcher?: TFnWatcher, render?: TFnRender): void;
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
export declare function watchDataByKey(target: IComponent, propertyName: string, watcher?: TFnWatcher, render?: TFnRender): void;
/**
 * recursive watch dependens in target
 *
 * @export
 * @param {*} target
 * @param {string} propertyName
 */
export declare function WatcherDependences(target: any, propertyName: string): void;
/**
 * Decorator @Watch in @Component
 *
 * add watch property in prototype chain of instance
 *
 * @export
 * @returns {(target: any, propertyName: string) => any}
 */
export declare function Watch(): (target: any, propertyName: string) => any;

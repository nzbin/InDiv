import { TFnWatcher, TFnRender } from '../types';
/**
 * Watcher for InDiv
 *
 * @class Watcher
 */
export declare class Watcher {
    data: any;
    watcher: TFnWatcher;
    render: TFnRender;
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
    constructor(data: any, watcher?: TFnWatcher, render?: TFnRender);
    watchData(data: any): void;
}

export declare type TFnWatcher = (oldData?: any) => void;
export declare type TFnRender = () => any;
/**
 * Watcher for InDiv
 *
 * @class Watcher
 */
export declare class Watcher {
    private data;
    private watcher;
    private render;
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
    private watchData;
}

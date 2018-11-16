import { TFnWatcher } from '../types';
/**
 * watch a key of an Object
 *
 * @class KeyWatcher
 */
export declare class KeyWatcher {
    private data;
    private watcher?;
    private key;
    constructor(data: any, key: string, watcher?: TFnWatcher);
    private watchData;
}

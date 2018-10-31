import { TFnWatcher } from '../types';
/**
 * watch a key of an Object
 *
 * @class KeyWatcher
 */
declare class KeyWatcher {
    data: any;
    watcher?: TFnWatcher;
    key: string;
    constructor(data: any, key: string, watcher?: TFnWatcher);
    watchData(data: any, key: string): void;
}
export default KeyWatcher;

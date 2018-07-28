import { IUtil } from './utils';

export type TFnWatcher = (oldData: any, newData: any) => void;

export interface IKeyWatcher {
    data: any;
    watcher?: TFnWatcher;
    key: string;
    utils: IUtil;
    watchData(data: any, key: string): void;
}

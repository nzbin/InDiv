import Utils from '../Utils';

export type IFnWatcher = (oldData: any, newData: any) => void;

export interface IKeyWatcher {
    data: any;
    watcher?: IFnWatcher;
    key: string;
    utils: Utils;
    watchData(data: any, key: string): void;
}

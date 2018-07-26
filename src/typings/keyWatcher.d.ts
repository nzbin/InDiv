import { IUtil } from './utils';

export type IFnWatcher = (oldData: any, newData: any) => void;

export interface IKeyWatcher {
    data: any;
    watcher?: IFnWatcher;
    key: string;
    utils: IUtil;
    watchData(data: any, key: string): void;
}
import { IUtils } from '../Utils/types';

export * from '../Utils/types';

export type IFnWatcher = (oldData: any, newData: any) => void;

export interface IKeyWatcher {
    data: any;
    watcher?: IFnWatcher;
    key: string;
    utils: IUtils;
    watchData(data: any, key: string): void;
}

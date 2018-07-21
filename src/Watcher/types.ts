import { IUtils } from '../Utils/types';

export * from '../Utils/types';

export type IFnWatcher = (oldData: any, newData: any) => void;
export type IFnRender = () => void;

export interface IWatcher {
    data: any;
    watcher?: IFnWatcher;
    render?: IFnRender;
    utils: IUtils;
    watchData(data: any): void;
}

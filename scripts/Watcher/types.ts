import Utils from '../Utils';

export type IFnWatcher = (oldData: any, newData: any) => void;
export type IFnRender = () => void;

export interface IWatcher {
    data: any;
    watcher?: IFnWatcher;
    render?: IFnRender;
    utils: Utils;
    watchData(data: any): void;
}

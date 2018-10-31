export declare type TFnWatcher = (oldData: any) => void;
export interface IKeyWatcher {
    data: any;
    watcher?: TFnWatcher;
    key: string;
    watchData(data: any, key: string): void;
}

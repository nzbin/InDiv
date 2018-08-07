import { ICompileUtil } from './compileUtils';
import { IUtil } from './utils';


export type ILocationState = {
    path: string;
    query?: any,
    params?: any;
};

export interface ILifecycle<Vm = any> {
    compileUtil?: ICompileUtil;
    utils?: IUtil;
    $location?: {
      state?: () => ILocationState;
      go?: (path: string, query?: any, params?: any) => void;
    };
    $vm?: Vm | any;

    $getLocationState(): ILocationState;
    $locationGo(path: string, query?: any, params?: any): void;
    esOnInit?(): void;
    esBeforeMount?(): void;
    esAfterMount?(): void;
    esOnDestory?(): void;
    esHasRender?(): void;
    esWatchState?(oldData?: any, newData?: any): void;
}

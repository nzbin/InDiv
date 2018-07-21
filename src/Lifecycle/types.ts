import { IUtils } from '../Utils/types';
import { ICompileUtil } from '../CompileUtils/types';

export * from '../Utils/types';
export * from '../CompileUtils/types';

export type ILocationState = {
  path: string;
  query?: any,
  params?: any;
}

export interface ILifecycle<Vm = any> {
    compileUtil: ICompileUtil;
    utils: IUtils;
    $location: {
      state: () => ILocationState;
      go: (path: string, query?: any, params?: any) => void;
    }
    $vm: Vm | any;

    $getLocationState(): ILocationState;
    $locationGo(path: string, query?: any, params?: any): void;
    $onInit(): void;
    $beforeMount?(): void;
    $afterMount?(): void;
    $onDestory?(): void;
    $hasRender?(): void;
    $watchState?(oldData?: any, newData?: any): void;
}

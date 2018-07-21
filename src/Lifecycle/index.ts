import { ILifecycle, ILocationState, ICompileUtil, IUtils } from './types';

import Utils from '../Utils';
import { CompileUtil } from '../CompileUtils';

abstract class Lifecycle<Vm> {
  compileUtil: ICompileUtil;
  utils: IUtils;
  $location: {
    state: () => ILocationState;
    go: (path: string, query?: any, params?: any) => void;
  }
  $vm: Vm | any;

  constructor() {
    this.compileUtil = new CompileUtil();
    this.utils = new Utils();
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
  }

  $getLocationState(): ILocationState {
    return {
      path: this.$vm.$esRouteObject.path,
      query: this.$vm.$esRouteObject.query,
      params: this.$vm.$esRouteObject.params,
    };
  }

  $locationGo(path: string, query?: any, params?: any): void {
    if (this.$vm.$esRouteMode === 'state') {
      const rootPath = this.$vm.$rootPath === '/' ? '' : this.$vm.$rootPath;
      history.pushState(
        {
          path,
          query,
          params,
        },
        null,
        `${rootPath}${path}${this.utils.buildQuery(query)}`);
    }
    if (this.$vm.$esRouteMode === 'hash') {
      history.pushState(
        {
          path,
          query,
          params,
        },
        null,
        `#${path}${this.utils.buildQuery(query)}`);
    }
    this.$vm.$esRouteObject = {
      path,
      query,
      params,
    };
  }

  $onInit(): void {}

  $beforeMount(): void {}

  $afterMount(): void {}

  $onDestory(): void {}

  $hasRender(): void {}

  $watchState(oldData?: any, newData?: any): void {}
}

export default Lifecycle;

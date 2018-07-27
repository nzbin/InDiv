import Utils from '../Utils';
import { CompileUtil } from '../CompileUtils';

abstract class Lifecycle<Vm = any> implements ES.ILifecycle {
  public compileUtil?: CompileUtil;
  public utils?: ES.IUtil;
  public $location?: {
    state?: () => ES.ILocationState;
    go?: (path: string, query?: any, params?: any) => void;
  }
  public $vm?: Vm | any;

  constructor() {
    this.compileUtil = new CompileUtil();
    this.utils = new Utils();
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
  }

  public $getLocationState(): ES.ILocationState {
    return {
      path: this.$vm.$esRouteObject.path,
      query: this.$vm.$esRouteObject.query,
      params: this.$vm.$esRouteObject.params,
    };
  }

  public $locationGo(path: string, query?: any, params?: any): void {
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

  public $onInit(): void {}

  public $beforeMount(): void {}

  public $afterMount(): void {}

  public $onDestory(): void {}

  public $hasRender(): void {}

  public $watchState(oldData?: any, newData?: any): void {}
}

export default Lifecycle;

import Utils from './Utils';
import { CompileUtil } from './CompileUtils';

class Lifecycle {
  constructor() {
    this.compileUtil = new CompileUtil();
    this.utils = new Utils();
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
  }

  $getLocationState() {
    return {
      path: this.$vm.$esRouteObject.path,
      query: this.$vm.$esRouteObject.query,
      params: this.$vm.$esRouteObject.params,
    };
  }

  $locationGo(path, query, params) {
    if (this.$vm.$esRouteMode === 'state') {
      const rootPath = this.$vm.$rootPath === '/' ? '' : this.$vm.$rootPath;
      history.pushState({
        path,
        query,
        params,
      }, null, `${rootPath}${path}${this.utils.buildQuery(query)}`);
    }
    if (this.$vm.$esRouteMode === 'hash') {
      history.pushState({
        path,
        query,
        params,
      }, null, `#${path}${this.utils.buildQuery(query)}`);
    }
    this.$vm.$esRouteObject = {
      path,
      query,
      params,
    };
  }

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $hasRender() {}

  $watchState(oldData, newData) {}
}

export default Lifecycle;

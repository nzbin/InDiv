const Utils = require('./Utils');

class Lifecycle {
  constructor() {
    this.state = {};
    this.utils = new Utils();
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
  }

  $declare() {
    this.$fatherDom = null;
    this.$template = '';
    this.$components = {};
  }

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $hasRender() {}

  $watchState(oldData, newData) {}

  $getLocationState() {
    return {
      path: window._esRouteObject.path,
      query: window._esRouteObject.query,
      params: window._esRouteObject.params,
    };
  }

  $locationGo(path, query, params) {
    if (window._esRouteMode === 'state') {
      history.pushState({
        path,
        query,
        params,
      }, null, `${path}${this.utils.buildQuery(query)}`);
    }
    if (window._esRouteMode === 'hash') {
      history.pushState({
        path,
        query,
        params,
      }, null, `#${path}${this.utils.buildQuery(query)}`);
    }
    window._esRouteObject = {
      path,
      query,
      params,
    };
  }

  setState(newState) {
    if (newState && this.utils.isFunction(newState)) {
      const _newState = newState();
      if (_newState && _newState instanceof Object) {
        for (let key in _newState) {
          if (this.state.hasOwnProperty(key) && this.state[key] !== _newState[key]) this.state[key] = _newState[key];
        }
      }
    }
    if (newState && newState instanceof Object) {
      for (let key in newState) {
        if (this.state.hasOwnProperty(key) && this.state[key] !== newState[key]) this.state[key] = newState[key];
      }
    }
  }
}

module.exports = Lifecycle;

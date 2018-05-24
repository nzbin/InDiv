const Utils = require('./Utils');

class Lifecycle {
  constructor() {
    this.declareTemplate = '';
    this.state = {};
    this.utils = new Utils();
    this.$location = {
      path: window._esRouteObject.path,
      query: window._esRouteObject.query,
      params: window._esRouteObject.params,
      go: this.$locationGo.bind(this),
    };
  }

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $hasRender() {}

  $watchState(oldData, newData) {}

  $locationGo(path, query, params) {
    window._esRouteObject = {
      path,
      query,
      params,
    };
    console.log('window._esRouteObject', window._esRouteObject);
    history.pushState({
      path,
      query,
      params,
    }, null, `${path}${this.utils.buildQuery(query)}`);
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

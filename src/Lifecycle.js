const Utils = require('./Utils');
const { CompileUtil } = require('./CompileUtils');

class Lifecycle {
  constructor() {
    this.state = {};
    this.$globalContext = {};
    this.utils = new Utils();
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
    this.$vm = null;
    this.compileUtil = new CompileUtil();
  }

  $declare() {
    this.$fatherDom = null;
    this.$template = '';
    this.$components = {};

    this.$componentList = {};
  }

  $componentsConstructor() {
    this.$componentss = {};
    const tagList = this.$template.match(/\<([^\/][^><]*[^\/])\>/g);
    tagList.forEach(li => {
      const tag = /^\<([^\s]+)\s*.*\>/g.exec(li)[1];
      if (this.$componentList[tag]) {
        const tagPropsList = li.replace(`<${tag}`, '').replace('>', '').split(' ');
        const props = {};
        tagPropsList.forEach(li => {
          const _prop = /^(.+)\=\"\{(.+)\}\"/.exec(li);
          if (li !== '') {
            props[_prop[1]] = this.compileUtil._getVMVal(this, _prop[2]);
          }
        });
        this.$componentss[tag] = new this.$componentList[tag](tag, props);
      }
    });
  }

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $hasRender() {}

  $watchState(oldData, newData) {}

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

  $setState(newState) {
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

  $setGlobalContext(newGlobalContext) {
    if (newGlobalContext && this.utils.isFunction(newGlobalContext)) {
      const _newGlobalContext = newGlobalContext();
      if (_newGlobalContext && _newGlobalContext instanceof Object) {
        for (let key in _newGlobalContext) {
          if (this.$globalContext.hasOwnProperty(key) && this.$globalContext[key] !== _newGlobalContext[key]) this.$globalContext[key] = _newGlobalContext[key];
        }
      }
    }
    if (newGlobalContext && newGlobalContext instanceof Object) {
      for (let key in newGlobalContext) {
        if (this.$globalContext.hasOwnProperty(key) && this.$globalContext[key] !== newGlobalContext[key]) {
          this.$globalContext[key] = newGlobalContext[key];
        }
      }
    }
  }
}

module.exports = Lifecycle;

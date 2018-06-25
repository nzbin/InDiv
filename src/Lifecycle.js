const Utils = require('./Utils');
const { CompileUtil } = require('./CompileUtils');

class Lifecycle {
  constructor() {
    this.compileUtil = new CompileUtil();
    this.utils = new Utils();
    this.state = {};
    this.$globalContext = {};
    this.$location = {
      state: this.$getLocationState.bind(this),
      go: this.$locationGo.bind(this),
    };
    this.$vm = null;
    this.$componentList = {};
    this.$components = [];
  }

  $declare() {
    this.$template = '';
    this.$componentList = {};
    this.$components = [];
  }

  $componentsConstructor(dom) {
    this.$components = [];
    for (const name in this.$componentList) {
      const tags = dom.getElementsByTagName(name);
      Array.from(tags).forEach(node => {
        const nodeAttrs = node.attributes;
        const props = {};
        if (nodeAttrs) {
          const attrList = Array.from(nodeAttrs);
          const _propsKeys = {};
          attrList.forEach(attr => {
            if (/^\_prop\-(.+)/.test(attr.name)) _propsKeys[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
          });
          attrList.forEach(attr => {
            const attrName = attr.name;
            const prop = /^\{(.+)\}$/.exec(attr.value);
            if (prop) {
              const valueList = prop[1].split('.');
              const key = valueList[0];
              let _prop = null;
              if (/^(this.).*/g.test(prop[1])) _prop = this.compileUtil._getVMVal(this, prop[1]);
              if (_propsKeys.hasOwnProperty(key)) _prop = this.getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = this.buildProps(_prop);
            }
            node.removeAttribute(attrName);
          });
        }
        this.$components.push({
          dom: node,
          props,
          scope: this.buildScope(this.$componentList[name], props, node),
        });
      });
    }
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

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $hasRender() {}

  $watchState(oldData, newData) {}

  getPropsValue(valueList, value) {
    let val = value;
    valueList.forEach((v, index) => {
      if (index === 0) return;
      val = val[v];
    });
    return val;
  }

  buildProps(prop) {
    if (this.utils.isFunction(prop)) {
      return prop.bind(this);
    } else {
      return prop;
    }
  }

  buildScope(ComponentClass, props, dom) {
    const _component = new ComponentClass(props);
    _component.$renderDom = dom;
    _component.$componentList = this.$componentList;
    return _component;
  }
}

module.exports = Lifecycle;

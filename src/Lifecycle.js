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

    this.$componentList = {};

    this.$componentss = [];
  }

  $declare() {
    this.$fatherDom = null;
    this.$template = '';
    this.$components = {};

    this.$componentList = {};

    this.$componentss = [];
  }

  $componentsConstructor(dom) {
    this.$componentss = [];
    for (const name in this.$componentList) {
      const tags = dom.getElementsByTagName(name);
      Array.from(tags).forEach(node => {
        const nodeAttrs = node.attributes;
        const props = {};
        if (nodeAttrs) {
          const attrList = Array.from(nodeAttrs);
          const _propsKeys = {};
          attrList.forEach(attr => {
            if (/^\_prop\-(.+)/.test(attr.name)) {
              _propsKeys[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
            }
          });
          attrList.forEach(attr => {
            const attrName = attr.name;
            const prop = /^\{(.+)\}$/.exec(attr.value);
            const valueList = prop[1].split('.');
            const key = valueList[0];
            // this
            if (prop && /^(this.).*/g.test(prop[1])) {
              const _prop = this.compileUtil._getVMVal(this, prop[1]);
              props[attrName] = this.buildProps(_prop);
            }
            // repeat
            if (prop && _propsKeys.hasOwnProperty(key)) {
              const _prop = this.getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = this.buildProps(_prop);
            }
            node.removeAttribute(attrName);
          });
        }
        this.$componentss.push({
          dom: node,
          props,
          scope: this.buildScope(this.$componentList[name], props, node),
        });
      });
    }
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

  buildScope(Cop, props, dom) {
    const _component = new Cop(null, props);
    _component.$renderDom = dom;
    _component.$componentList = this.$componentList;
    return _component;
  }
}

module.exports = Lifecycle;

const Lifecycle = require('./Lifecycle');
const Compile = require('./Compile');
const Watcher = require('./Watcher');

class Component extends Lifecycle {
  constructor(props) {
    super();
    if (props) this.props = props;
    this.state = {};
    this.$renderDom = null;
    this.$globalContext = {};

    this.$vm = null;
    this.$template = null;
    this.$components = {};
    this.$componentList = [];

    if (this.$bootstrap) this.$bootstrap();
  }

  $bootstrap() {
    this.$template = null;
  }

  $beforeInit() {
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $render() {
    const dom = this.$renderDom;
    this.compile = new Compile(dom, this);
    this.$mountComponent(dom, true);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$render();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }

  $reRender() {
    const dom = this.$renderDom;
    const routerRenderDom = dom.querySelectorAll(this.$vm.$routeDOMKey)[0];
    this.compile = new Compile(dom, this, routerRenderDom);
    this.$mountComponent(dom, false);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }

  $mountComponent(dom, isFirstRender) {
    const saveStates = [];
    this.$componentList.forEach(component => {
      saveStates.push(component);
    });
    this.$componentsConstructor(dom);
    this.$componentList.forEach(component => {
      const saveComponent = saveStates.find(save => save.dom === component.dom);
      if (saveComponent) {
        component.scope = saveComponent.scope;
        component.scope.props = component.props;
      }
      component.scope.$vm = this.$vm;
      component.scope.$globalContext = this.$globalContext;
      component.scope.$components = this.$components;
      if (component.scope.$beforeInit) component.scope.$beforeInit();
      if (component.scope.$onInit && isFirstRender) component.scope.$onInit();
      if (component.scope.$beforeMount) component.scope.$beforeMount();
    });
  }

  $componentsConstructor(dom) {
    this.$componentList = [];
    for (const name in this.$components) {
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
        this.$componentList.push({
          dom: node,
          props,
          scope: this.buildComponentScope(this.$components[name], props, node),
        });
      });
    }
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

  $setProps(newProps) {
    if (newProps && this.utils.isFunction(newProps)) {
      const _newProps = newProps();
      if (_newProps && _newProps instanceof Object) {
        for (let key in _newProps) {
          if (this.props.hasOwnProperty(key) && this.props[key] !== _newProps[key]) this.props[key] = _newProps[key];
        }
      }
    }
    if (newProps && newProps instanceof Object) {
      for (let key in newProps) {
        if (this.props.hasOwnProperty(key) && this.props[key] !== newProps[key]) {
          this.props[key] = newProps[key];
        }
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

  buildComponentScope(ComponentClass, props, dom) {
    const _component = new ComponentClass(props);
    _component.$renderDom = dom;
    _component.$declaredComponents = this.$components;
    return _component;
  }
}

module.exports = Component;

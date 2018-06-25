const Lifecycle = require('./Lifecycle');
const Compile = require('./Compile');
const Watcher = require('./Watcher');

class Component extends Lifecycle {
  constructor(props) {
    super();
    if (props) this.props = props;
    this.state = {};
    this.$renderDom = null;
  }

  $beforeInit() {
    if (this.$declare) this.$declare();
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $mountComponent(dom) {
    const saveStates = [];
    this.$components.forEach(component => {
      saveStates.push(component);
    });
    if (this.$declare) this.$declare();
    this.$componentsConstructor(dom);
    this.$components.forEach((component, index) => {
      const saveComponent = saveStates.find(save => save.dom === component.dom);
      if (saveComponent) {
        component.scope = saveComponent.scope;
        component.scope.props = component.props;
      }
      if (component.scope.$beforeInit) component.scope.$beforeInit();
      if (component.scope.$globalContext) component.scope.$globalContext = this.$globalContext;
      if (component.scope.$vm) component.scope.$vm = this.$vm;
      if (component.scope.$onInit) component.scope.$onInit();
      if (component.scope.$beforeMount) component.scope.$beforeMount();
    });
  }

  $render() {
    const dom = this.$renderDom;
    this.compile = new Compile(dom, this);
    this.$mountComponent(dom);
    this.$components.forEach(component => {
      if (component.scope.$render) component.scope.$render();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }

  $reRender() {
    const dom = this.$renderDom;
    // if (this.$onDestory) this.$onDestory();
    this.compile = new Compile(dom, this);
    this.$mountComponent(dom);
    this.$components.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
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
}

module.exports = Component;

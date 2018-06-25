const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const Compile = require('./Compile');

class Controller extends Lifecycle {
  constructor() {
    super();
    this.state = {};
  }

  $beforeInit() {
    if (this.$declare) this.$declare();
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $mountComponent(dom) {
    const saveStates = [];
    this.$components.forEach(component => {
      saveStates.push(component);
    });
    if (this.$declare) this.$declare();
    // if (this.$inject) this.$inject();
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

  // must assign a DOM for render controller
  $render(dom) {
    if (!dom) {
      console.error('must assign a DOM for render controller');
      return;
    }
    this.dom = dom;
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
    const dom = this.dom;
    const routerRenderDom = dom.querySelectorAll(this.$vm.$routeDOMKey)[0];
    this.compile = new Compile(dom, this, routerRenderDom);
    this.$mountComponent(dom);
    this.$components.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }
}

module.exports = Controller;

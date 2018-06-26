const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const Compile = require('./Compile');

class Controller extends Lifecycle {
  constructor() {
    super();
    this.state = {};
    if (this.$declarations) this.$declarations();
  }

  $declarations() {
    this.$components = {};
  }

  $beforeInit() {
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  // must assign a DOM for render controller
  $render(dom) {
    if (!dom) {
      console.error('must assign a DOM for render controller');
      return;
    }
    this.dom = dom;
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
    const dom = this.dom;
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
}

module.exports = Controller;

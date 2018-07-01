const Utils = require('./Utils');

class Easiest {
  constructor() {
    this.modalList = [];
    this.utils = new Utils();
    this.$globalContext = {};
    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$esRouteMode = null;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
  }

  $use(modal) {
    modal.$init(this);
    this.modalList.push(modal);
    return this.modalList.findIndex(md => this.utils.isEqual(md, modal));
  }

  $setRootPath(rootPath) {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      console.error('rootPath is not defined or rootPath must be a String');
    }
  }

  $bootstrapModule(Esmodule) {
    if (!Esmodule) {
      console.error('must send a root module');
      return;
    }
    this.$rootModule = new Esmodule();
    this.$rootModule.$vm = this;
    this.$rootModule.$globalContext = this.$globalContext;
  }

  $init() {
    if (!this.$rootModule) {
      console.error('must use $bootstrapModule to declare a root EsModule before $init');
      return;
    }
    if (this.$canRenderModule) this.$renderModuleBootstrap();
  }

  $renderModuleBootstrap() {
    if (!this.$rootModule.$bootstrap) {
      console.error('need $bootstrap for render Module Bootstrap');
      return;
    }
    const Component = this.$rootModule.$bootstrap;
    const component = new Component();
    this.$renderComponent(component, this.rootDom);
  }

  $renderComponent(component, renderDOM) {
    component.$vm = this;
    component.$components = this.$rootModule.$components;
    if (component.$beforeInit) component.$beforeInit();
    if (component.$onInit) component.$onInit();
    if (!component.$template) {
      console.error('must decaler this.$template in $bootstrap()');
      return;
    }
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.$beforeMount) component.$beforeMount();
      this.replaceDom(component, renderDOM).then(() => {
        if (component.$afterMount) component.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderBootstrap failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(component, renderDOM) {
    component.$renderDom = renderDOM;
    if (component.$render) {
      component.$render();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}

module.exports = Easiest;

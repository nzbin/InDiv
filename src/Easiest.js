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

    this.$rootModule.rootDom = this.rootDom;
  }

  $init() {
    if (!this.$rootModule) {
      console.error('must use $bootstrapModule to declare a root EsModule');
      return;
    }
    if (this.$canRenderModule) this.$renderModule();
  }

  $renderModule() {
    this.$canRenderModule.$renderBootstrap();
  }

  $renderModuleComponent(component, renderDOM) {
    this.$rootModule.$renderComponent(component, renderDOM);
  }
}

module.exports = Easiest;

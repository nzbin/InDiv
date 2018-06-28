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

  $init(Esmodule) {
    if (this.$canRenderModule && Esmodule) {
      const esmodule = new Esmodule();
      this.$renderModule(esmodule, this.rootDom);
    }
    if (this.$canRenderModule && !Esmodule) console.error('esmodule render has been trusteeshiped to Router');
  }

  $renderModule(esmodule, rootDom) {
    esmodule.$vm = this;
    esmodule.$globalContext = this.$globalContext;

    esmodule.rootDom = rootDom;
    esmodule.$renderBootstrap();
  }
}

module.exports = Easiest;

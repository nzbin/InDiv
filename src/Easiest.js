const Utils = require('./Utils');

class Easiest {
  constructor() {
    this.modalList = [];
    this.utils = new Utils();
    this.$globalContext = {};
    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderController = true;
    this.$esRouteMode = null;
    this.$routeDOMKey = 'router-render';
  }

  $use(modal) {
    modal.$use(this);
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

  $init(Controller) {
    if (this.$canRenderController && Controller) {
      const controller = new Controller();
      this.$renderController(controller, this.rootDom);
    }
    if (this.$canRenderController && !Controller) console.error('controller render has been trusteeshiped to Router');
  }

  $renderController(controller, rootDom) {
    controller.$vm = this;
    controller.$globalContext = this.$globalContext;

    controller.rootDom = rootDom;
    controller.$renderBootstrap();
  }
}

module.exports = Easiest;

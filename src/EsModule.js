class EsModule {
  constructor() {
    this.rootDom = null;
    this.$vm = null;
    if (this.$declarations) this.$declarations();
  }

  $declarations() {
    this.$components = {};
    this.$providers = {};
    this.$bootstrap = function () {};
  }

  $renderBootstrap() {
    if (!this.$bootstrap) {
      console.error('need $bootstrap for renderBootstrap');
      return;
    }
    const controller = new this.$bootstrap();
    controller.$vm = this.$vm;
    console.log('controllercontroller', controller);
    controller.$components = this.$components;
    if (controller.$beforeInit) controller.$beforeInit();
    if (controller.$onInit) controller.$onInit();
    if (!controller.$template) {
      console.error('must decaler this.$template in $bootstrap()');
      return;
    }
    const template = controller.$template;
    if (template && typeof template === 'string' && this.rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller).then(() => {
        if (controller.$afterMount) controller.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderController failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(controller) {
    controller.$renderDom = this.rootDom;
    if (controller.$render) {
      controller.$render();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}

module.exports = EsModule;

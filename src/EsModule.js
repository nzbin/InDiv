class EsModule {
  constructor() {
    // this.rootDom = null;
    // this.$vm = null;
    // this.$globalContext = null;
    this.$exportList = {};

    if (this.$declarations) this.$declarations();
    if (this.$buildExports) this.$buildExports();
    if (this.$buildImports) this.$buildImports();
  }

  $declarations() {
    this.$imports = [];
    this.$components = {};
    this.$providers = [];
    this.$exports = [];
    this.$bootstrap = function () {};
  }

  $buildExports() {
    if (!this.$exports) return;
    this.$exports.forEach(ex => {
      if (this.$components[ex]) {
        const result = {};
        this.$exportList[ex] = this.$components[ex];
        return result;
      }
    });
  }

  $buildImports() {
    if (!this.$imports) return;
    this.$imports.forEach(ModuleImport => {
      const moduleImport = new ModuleImport();
      for (let name in moduleImport.$exportList) {
        this.$components[name] = moduleImport.$exportList[name];
      }
    });
  }

  // $renderBootstrap() {
  //   if (!this.$bootstrap) {
  //     console.error('need $bootstrap for renderBootstrap');
  //     return;
  //   }
  //   const component = new this.$bootstrap();
  //   this.$renderComponent(component, this.rootDom);
  // }

  // $renderComponent(component, renderDOM) {
  //   component.$vm = this.$vm;
  //   component.$components = this.$components;
  //   if (component.$beforeInit) component.$beforeInit();
  //   if (component.$onInit) component.$onInit();
  //   if (!component.$template) {
  //     console.error('must decaler this.$template in $bootstrap()');
  //     return;
  //   }
  //   const template = component.$template;
  //   if (template && typeof template === 'string' && renderDOM) {
  //     if (component.$beforeMount) component.$beforeMount();
  //     this.replaceDom(component, renderDOM).then(() => {
  //       if (component.$afterMount) component.$afterMount();
  //     });
  //     return Promise.resolve();
  //   } else {
  //     console.error('renderBootstrap failed: template or rootDom is not exit');
  //     return Promise.reject();
  //   }
  // }

  // replaceDom(component, renderDOM) {
  //   component.$renderDom = renderDOM;
  //   if (component.$render) {
  //     component.$render();
  //     return Promise.resolve();
  //   } else {
  //     return Promise.reject();
  //   }
  // }
}

module.exports = EsModule;

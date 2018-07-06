const Utils = require('./Utils');

class EsModule {
  constructor() {
    this.utils = new Utils();
    this.$exportList = {};

    this.$declarations();
    this.$buildComponents4Components();
    this.$buildExports();
    this.$buildImports();
    console.log('this.$c!!', this.$components);
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
      moduleImport.$providers.forEach(service => {
        if (!this.$providers.find(se => this.utils.isEqual(service, se))) {
          this.$providers.push(service);
        }
      });
    });
  }

  $buildComponents4Components() {
    if (!this.$components) return;
    for (const name in this.$components) {
      const component = this.$components[name];
      component._injectedComponents = this.$components;
    }
  }
}

module.exports = EsModule;

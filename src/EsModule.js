const Utils = require('./Utils');

class EsModule {
  constructor() {
    this.utils = new Utils();
    this.$exportList = {};

    this.$declarations();
    this.$buildExports();
    this.$buildImports();
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
}

module.exports = EsModule;

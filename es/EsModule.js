import Utils from './Utils';

class EsModule {
  constructor() {
    this.utils = new Utils();
    this.$exportList = {};

    this.singletonList = new Map();

    this.$declarations();
    this.$buildImports();
    this.$buildComponents4Components();
    this.$buildProviders4Components();
    this.$buildExports();
  }

  $declarations() {
    this.$imports = [];
    this.$components = {};
    this.$providers = [];
    this.$exports = [];

    this.singletonList = new Map();
    this.$bootstrap = function () {};
  }

  $buildExports() {
    if (!this.$exports) return;
    this.$exports.forEach(ex => {
      if (this.$components[ex]) this.$exportList[ex] = this.$components[ex];
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

  $buildComponents4Components() {
    if (!this.$components) return;
    for (const name in this.$components) {
      const component = this.$components[name];
      if (component._injectedComponents) {
        component._injectedComponents = Object.assign(component._injectedComponents, this.$components);
      } else {
        component._injectedComponents = this.$components;
      }
    }
  }

  $buildProviders4Components() {
    if (!this.$providers) return;
    // this.singletonList = this.$providers.map(Service => {
    //   console.log('service', Service.name);
    //   return Service.getInstance();
    // });
    this.$providers.forEach(service => {
      this.singletonList.set(`${service.name.charAt(0).toUpperCase()}${service.name.slice(1)}`, service.getInstance());
      // return service.getInstance();
    });
    for (const name in this.$components) {
      const component = this.$components[name];
      if (component._injectedProviders) {
        this.singletonList.forEach((value, key) => {
          if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          // if (!component._injectedProviders.find(provider => provider.constructor.name === singleton.constructor.name)) component._injectedProviders.push(singleton);
        });
      } else {
      // if (component._injectedProviders && component._injectedProviders.length > 0) {
      //   this.singletonList.forEach(singleton => {
      //     if (!component._injectedProviders.find(provider => provider.constructor.name === singleton.constructor.name)) component._injectedProviders.push(singleton);
      //   });
      // } else {
        component._injectedProviders = this.singletonList;
      }
    }
  }
}

export default EsModule;

import Utils from '../Utils';

import { INvModule } from '../types';

type TNvModuleOptions = {
  imports?: Function[],
  components: {
    [name: string]: Function;
  },
  providers?: Function[],
  exports?: string[],
  bootstrap?: Function,
};

export function NvModule(options: TNvModuleOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    const vm = _constructor.prototype;
    vm.$exportList = {};
    vm.providerList = new Map();
    vm.utils = new Utils();
    if (options.imports) vm.$imports = options.imports;
    if (options.components) vm.$components = options.components;
    if (options.providers) vm.$providers = options.providers;
    if (options.exports) vm.$exports = options.exports;
    if (options.bootstrap) vm.bootstrap = options.bootstrap;

    vm.buildImports = function (): void {
      if (!(this as INvModule).$imports) return;
      (this as INvModule).$imports.forEach((ModuleImport: any) => {
        // const moduleImport = new ModuleImport();
        const moduleImport = factoryModule(ModuleImport);
        for (const name in moduleImport.$exportList) {
          this.$components[name] = moduleImport.$exportList[name];
        }
      });
    };

    vm.buildProviderList = function (): void {
      if (!(this as INvModule).$providers) return;
      (this as INvModule).$providers.forEach((service: any) => this.providerList.set(`${service.name.charAt(0).toUpperCase()}${service.name.slice(1)}`, service));
    };

    vm.buildProviders4Services = function (): void {
      if (!this.$providers) return;
      for (const name in (this as INvModule).$providers) {
        const service: any = (this as INvModule).$providers[name];
        if (service._injectedProviders) {
          (this as INvModule).providerList.forEach((value, key) => {
            if (!service._injectedProviders.has(key)) service._injectedProviders.set(key, value);
          });
        } else {
          service._injectedProviders = (this as INvModule).providerList;
        }
      }
    };

    vm.buildProviders4Components = function (): void {
      if (!(this as INvModule).$providers) return;
      for (const name in (this as INvModule).$components) {
        const component: any = (this as INvModule).$components[name];
        if (component._injectedProviders) {
          (this as INvModule).providerList.forEach((value, key) => {
            if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          });
        } else {
          component._injectedProviders = this.providerList;
        }
      }
    };

    vm.buildComponents4Components = function (): void {
      if (!this.$components) return;
      for (const name in (this as INvModule).$components) {
        const FindComponent: any = (this as INvModule).$components[name];
        if (FindComponent._injectedComponents) {
          FindComponent._injectedComponents = Object.assign(FindComponent._injectedComponents, (this as INvModule).$components);
        } else {
          FindComponent._injectedComponents = (this as INvModule).$components;
        }
      }
    };

    vm.buildExports = function (): void {
      if (!(this as INvModule).$exports) return;
      (this as INvModule).$exports.forEach(ex => {
        if ((this as INvModule).$components[ex]) (this as INvModule).$exportList[ex] = (this as INvModule).$components[ex];
      });
    };
  };
}

export function factoryModule(EM: Function): INvModule {
  const em = new (EM as any)();
  em.buildImports();
  em.buildProviderList();
  em.buildProviders4Services();
  em.buildComponents4Components();
  em.buildProviders4Components();
  em.buildExports();
  return em;
}

// export default NvModule;

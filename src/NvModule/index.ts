import Utils from '../Utils';

import { INvModule, TInjectTokenProvider } from '../types';

type TNvModuleOptions = {
  imports?: Function[];
  components: Function[];
  providers?: (Function | TInjectTokenProvider)[];
  exports?: Function[];
  bootstrap?: Function;
};

/**
 * Decorator @NvModule
 * 
 * to decorate an InDiv NvModule
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function NvModule(options: TNvModuleOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    const vm = _constructor.prototype as INvModule;
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
        const moduleImport = factoryModule(ModuleImport);
        for (let i = 0; i <= moduleImport.$exports.length - 1; i++) {
          const importComponent = moduleImport.$exports[i];
          if (!this.$components.find((component: any) => component.$selector === (importComponent as any).$selector)) {
            this.$components.push(importComponent);
          }
        }
      });
    };

    vm.buildProviderList = function (): void {
      if (!(this as INvModule).$providers) return;
      (this as INvModule).$providers.forEach(service => {
        if ((service as TInjectTokenProvider).injectToken) {
          (this as INvModule).providerList.set((service as TInjectTokenProvider).injectToken, (service as TInjectTokenProvider).useClass);
        } else {
          (this as INvModule).providerList.set(service as Function, service as Function);
        }
      });
    };

    vm.buildProviders4Services = function (): void {
      if (!this.$providers) return;
      for (let i = 0; i <= this.$providers.length - 1; i++) {
        const service: any = (this as INvModule).$providers[i];
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
      for (let i = 0; i <= this.$components.length - 1; i++) {
        const component: any = (this as INvModule).$components[i];
        if (component._injectedProviders) {
          (this as INvModule).providerList.forEach((value, key) => {
            if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          });
        } else {
          component._injectedProviders = (this as INvModule).providerList;
        }
      }
    };

    vm.buildComponents4Components = function (): void {
      if (!this.$components) return;
      for (let i = 0; i <= this.$components.length - 1; i++) {
        const FindComponent: any = (this as INvModule).$components[i];
        if (FindComponent._injectedComponents) {
          (this as INvModule).$components.forEach((needInjectComponent: any) => {
            if (!FindComponent._injectedComponents.find((c: any) => c.$selector === needInjectComponent.$selector)) FindComponent._injectedComponents.push(needInjectComponent);
          });
        } else {
          FindComponent._injectedComponents = (this as INvModule).$components;
        }
      }
    };
  };
}

/**
 * create an NvModule instance with factory method
 *
 * @export
 * @param {Function} NM
 * @returns {INvModule}
 */
export function factoryModule(NM: Function): INvModule {
  const nm = new (NM as any)();
  nm.buildImports();
  nm.buildProviderList();
  nm.buildProviders4Services();
  nm.buildComponents4Components();
  nm.buildProviders4Components();
  return nm;
}

import { INvModule, TInjectTokenProvider, TUseClassProvider, TuseValueProvider } from '../types';

type TNvModuleOptions = {
  imports?: Function[];
  components: Function[];
  providers?: (Function | TUseClassProvider | TuseValueProvider)[];
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
    vm.$providerList = new Map();
    vm.$providerInstances = new Map();
    if (options.imports) vm.$imports = options.imports;
    if (options.components) vm.$components = options.components;
    if (options.providers) vm.$providers = options.providers;
    if (options.exports) vm.$exports = options.exports;
    if (options.bootstrap) vm.$bootstrap = options.bootstrap;

    vm.buildProviderList = function (): void {
      if (!(this as INvModule).$providers) return;
      const length = this.$providers.length;
      for (let i = 0; i < length; i++) {
        const service = (this as INvModule).$providers[i];
        if ((service as TInjectTokenProvider).provide) {
          if ((service as TUseClassProvider).useClass || (service as TuseValueProvider).useValue) (this as INvModule).$providerList.set((service as TInjectTokenProvider).provide, service);
        } else {
          (this as INvModule).$providerList.set(service as Function, service as Function);
        }
      }
    };

    vm.buildProviders4Services = function (): void {
      if (!this.$providers) return;
      const length = this.$providers.length;
      for (let i = 0; i < length; i++) {
        const service: any = (this as INvModule).$providers[i];

        if ((service as TInjectTokenProvider).provide) {
          if ((service as TUseClassProvider).useClass) {
            if (!((service as TUseClassProvider).useClass as any)._injectedProviders) ((service as TUseClassProvider).useClass as any)._injectedProviders = new Map();
            (this as INvModule).$providerList.forEach((value, key) => {
              if (!((service as TUseClassProvider).useClass as any)._injectedProviders.has(key)) ((service as TUseClassProvider).useClass as any)._injectedProviders.set(key, value);
            });
          }
        } else {
          if (!service._injectedProviders) service._injectedProviders = new Map();
          (this as INvModule).$providerList.set(service as Function, service as Function);
        }
      }
    };

    vm.buildProviders4Components = function (): void {
      if (!(this as INvModule).$providers || !(this as INvModule).$components) return;
      const length = this.$components.length;
      for (let i = 0; i < length; i++) {
        const component: any = (this as INvModule).$components[i];
        if (!component._injectedProviders) component._injectedProviders = new Map();
        (this as INvModule).$providerList.forEach((value, key) => {
          if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
        });
      }
    };

    vm.buildComponents4Components = function (): void {
      if (!this.$components) return;
      const length = this.$components.length;
      for (let i = 0; i < length; i++) {
        const FindComponent: any = (this as INvModule).$components[i];
        if (!FindComponent._injectedComponents) FindComponent._injectedComponents = [];
        (this as INvModule).$components.forEach((needInjectComponent: any) => {
          if (!FindComponent._injectedComponents.find((c: any) => c.$selector === needInjectComponent.$selector)) FindComponent._injectedComponents.push(needInjectComponent);
        });
      }
    };

    vm.buildImports = function (): void {
      if (!(this as INvModule).$imports) return;
      const length = this.$imports.length;
      for (let i = 0; i < length; i++) {
        const ModuleImport = (this as INvModule).$imports[i];
        const moduleImport = factoryModule(ModuleImport);
        const exportsLength = moduleImport.$exports.length;
        for (let i = 0; i < exportsLength; i++) {
          const importComponent = moduleImport.$exports[i];
          if (!this.$components.find((component: any) => component.$selector === (importComponent as any).$selector)) {
            this.$components.push(importComponent);
          }
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
  nm.buildProviderList();
  nm.buildProviders4Services();
  nm.buildComponents4Components();
  nm.buildProviders4Components();
  nm.buildImports();
  return nm;
}

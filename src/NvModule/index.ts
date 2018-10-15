import { INvModule, TInjectTokenProvider, TUseClassProvider, TuseValueProvider } from '../types';

type TNvModuleOptions = {
  imports?: Function[];
  declarations: Function[];
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
    if (options.declarations) vm.$declarations = options.declarations;
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

    vm.buildProviders4Declarations = function (): void {
      if (!(this as INvModule).$providers || !(this as INvModule).$declarations) return;
      const length = this.$declarations.length;
      for (let i = 0; i < length; i++) {
        const FindDeclaration: any = (this as INvModule).$declarations[i];
        if (!FindDeclaration._injectedProviders) FindDeclaration._injectedProviders = new Map();
        (this as INvModule).$providerList.forEach((value, key) => {
          if (!FindDeclaration._injectedProviders.has(key)) FindDeclaration._injectedProviders.set(key, value);
        });
      }
    };

    vm.buildDeclarations4Declarations = function (): void {
      if (!this.$declarations) return;
      const length = this.$declarations.length;
      for (let i = 0; i < length; i++) {
        const FindDeclaration: any = (this as INvModule).$declarations[i];
        if (!FindDeclaration._injectedDeclarations) FindDeclaration._injectedDeclarations = new Map();
        (this as INvModule).$declarations.forEach((needInjectDeclaration: any) => {
          if (!FindDeclaration._injectedDeclarations.has(needInjectDeclaration.$selector)) FindDeclaration._injectedDeclarations.set(needInjectDeclaration.$selector, needInjectDeclaration);
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
          const importDeclaration = moduleImport.$exports[i];
          if (!this.$declarations.find((declaration: any) => declaration.$selector === (importDeclaration as any).$selector)) {
            this.$declarations.push(importDeclaration);
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
  nm.buildDeclarations4Declarations();
  nm.buildProviders4Declarations();
  nm.buildImports();
  return nm;
}

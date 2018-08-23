import Utils from '../Utils';

import { INvModule } from '../types';

type TNvModuleOptions = {
  imports?: Function[],
  // components: {
  //   [name: string]: Function;
  // },
  components: Function[],
  providers?: Function[],
  // exports?: string[],
  exports?: Function[],
  bootstrap?: Function,
};

export function NvModule(options: TNvModuleOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    const vm = _constructor.prototype as INvModule;
    // vm.$exportList = {};
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
        // for (const name in moduleImport.$exportList) {
        //   this.$components[name] = moduleImport.$exportList[name];
        // }
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
      for (let i = 0; i <= this.$components.length - 1; i++) {
        const component: any = (this as INvModule).$components[i];
        if (component._injectedProviders) {
          (this as INvModule).providerList.forEach((value, key) => {
            if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          });
        } else {
          component._injectedProviders = this.providerList;
        }
      }
      // for (const name in (this as INvModule).$components) {
      //   const component: any = (this as INvModule).$components[name];
      //   if (component._injectedProviders) {
      //     (this as INvModule).providerList.forEach((value, key) => {
      //       if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
      //     });
      //   } else {
      //     component._injectedProviders = this.providerList;
      //   }
      // }
    };

    vm.buildComponents4Components = function (): void {
      if (!this.$components) return;
      // for (const name in (this as INvModule).$components) {
      //   const FindComponent: any = (this as INvModule).$components[name];
      //   if (FindComponent._injectedComponents) {
      //     FindComponent._injectedComponents = Object.assign(FindComponent._injectedComponents, (this as INvModule).$components);
      //   } else {
      //     FindComponent._injectedComponents = (this as INvModule).$components;
      //   }
      // }
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

    // vm.buildExports = function (): void {
    //   if (!(this as INvModule).$exports) return;
    //   (this as INvModule).$exports.forEach(ex => {
    //     if ((this as INvModule).$components[ex]) (this as INvModule).$exportList[ex] = (this as INvModule).$components[ex];
    //   });
    // };
  };
}

export function factoryModule(NM: Function): INvModule {
  const nm = new (NM as any)();
  nm.buildImports();
  nm.buildProviderList();
  nm.buildProviders4Services();
  nm.buildComponents4Components();
  nm.buildProviders4Components();

  console.log(11111, nm.$components);
  console.log(22222, nm.$exports);
  // em.buildExports();
  return nm;
}

// export default NvModule;

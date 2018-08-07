import { IService } from '../types';

import Utils from '../Utils';

import { IEsModule } from '../types/esModule';

// class EsModule {
//   public utils?: Utils;
//   public $imports?: Function[];
//   public $components?: {
//       [name: string]: Function;
//   };
//   public $providers?: Function[];
//   public $exports?: string[];
//   public $exportList?: {
//     [name: string]: Function;
//   };
//   public providerList?: Map<string, IService>;
//   public $bootstrap?: Function;

//   constructor() {
//     this.utils = new Utils();

//     this.$imports = [];
//     this.$components = {};
//     this.$providers = [];
//     this.$exports = [];

//     this.$exportList = {};
//     this.providerList = new Map();

//     this.$bootstrap = function () {};

//     this.$declarations();
//     this.$buildImports();
//     this.$buildProviderList();
//     this.$buildProviders4Services();
//     this.$buildComponents4Components();
//     this.$buildProviders4Components();
//     this.$buildExports();
//   }

//   public $declarations(): void {
//     this.$imports = [];
//     this.$components = {};
//     this.$providers = [];
//     this.$exports = [];
//     this.$bootstrap = function () {};
//   }

//   public $buildImports(): void {
//     if (!this.$imports) return;
//     this.$imports.forEach((ModuleImport: any) => {
//       const moduleImport = new ModuleImport();
//       for (const name in moduleImport.$exportList) {
//         this.$components[name] = moduleImport.$exportList[name];
//       }
//     });
//   }

//   public $buildProviderList(): void {
//     if (!this.$providers) return;
//     this.$providers.forEach((service: any) => this.providerList.set(`${service.name.charAt(0).toUpperCase()}${service.name.slice(1)}`, service));
//   }

//   public $buildProviders4Services(): void {
//     if (!this.$providers) return;
//     for (const name in this.$providers) {
//       const service: any = this.$providers[name];
//       if (service._injectedProviders) {
//         this.providerList.forEach((value, key) => {
//           if (!service._injectedProviders.has(key)) service._injectedProviders.set(key, value);
//         });
//       } else {
//         service._injectedProviders = this.providerList;
//       }
//     }
//   }

//   public $buildProviders4Components(): void {
//     if (!this.$providers) return;
//     for (const name in this.$components) {
//       const component: any = this.$components[name];
//       if (component._injectedProviders) {
//         this.providerList.forEach((value, key) => {
//           if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
//         });
//       } else {
//         component._injectedProviders = this.providerList;
//       }
//     }
//   }

//   public $buildComponents4Components(): void {
//     if (!this.$components) return;
//     for (const name in this.$components) {
//       const FindComponent: any = this.$components[name];
//       if (FindComponent._injectedComponents) {
//         FindComponent._injectedComponents = Object.assign(FindComponent._injectedComponents, this.$components);
//       } else {
//         FindComponent._injectedComponents = this.$components;
//       }
//     }
//   }

//   public $buildExports(): void {
//     if (!this.$exports) return;
//     this.$exports.forEach(ex => {
//       if (this.$components[ex]) this.$exportList[ex] = this.$components[ex];
//     });
//   }
// }
type TEsModuleOptions = {
  imports?: Function[],
  components: {
    [name: string]: Function;
  },
  providers?: Function[],
  exports?: string[],
  bootstrap?: Function,
};

export function EsModule(options: TEsModuleOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    const vm = _constructor.prototype;
    vm.$exportList = {};
    vm.providerList = new Map();
    vm.utils = new Utils();
    if (options.imports) vm.$imports = options.imports;
    if (options.components) vm.$components = options.components;
    if (options.providers) vm.$providers = options.providers;
    if (options.exports) vm.$exports = options.exports;
    if (options.bootstrap) vm.$bootstrap = options.bootstrap;

    vm.$buildImports = function (): void {
      if (!(this as IEsModule).$imports) return;
      (this as IEsModule).$imports.forEach((ModuleImport: any) => {
        // const moduleImport = new ModuleImport();
        const moduleImport = factoryModule(ModuleImport);
        for (const name in moduleImport.$exportList) {
          this.$components[name] = moduleImport.$exportList[name];
        }
      });
    };

    vm.$buildProviderList = function (): void {
      if (!(this as IEsModule).$providers) return;
      (this as IEsModule).$providers.forEach((service: any) => this.providerList.set(`${service.name.charAt(0).toUpperCase()}${service.name.slice(1)}`, service));
    };

    vm.$buildProviders4Services = function (): void {
      if (!this.$providers) return;
      for (const name in (this as IEsModule).$providers) {
        const service: any = (this as IEsModule).$providers[name];
        if (service._injectedProviders) {
          (this as IEsModule).providerList.forEach((value, key) => {
            if (!service._injectedProviders.has(key)) service._injectedProviders.set(key, value);
          });
        } else {
          service._injectedProviders = (this as IEsModule).providerList;
        }
      }
    };

    vm.$buildProviders4Components = function (): void {
      if (!(this as IEsModule).$providers) return;
      for (const name in (this as IEsModule).$components) {
        const component: any = (this as IEsModule).$components[name];
        if (component._injectedProviders) {
          (this as IEsModule).providerList.forEach((value, key) => {
            if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          });
        } else {
          component._injectedProviders = this.providerList;
        }
      }
    };

    vm.$buildComponents4Components = function (): void {
      if (!this.$components) return;
      for (const name in (this as IEsModule).$components) {
        const FindComponent: any = (this as IEsModule).$components[name];
        if (FindComponent._injectedComponents) {
          FindComponent._injectedComponents = Object.assign(FindComponent._injectedComponents, (this as IEsModule).$components);
        } else {
          FindComponent._injectedComponents = (this as IEsModule).$components;
        }
      }
    };

    vm.$buildExports = function (): void {
      if (!(this as IEsModule).$exports) return;
      (this as IEsModule).$exports.forEach(ex => {
        if ((this as IEsModule).$components[ex]) (this as IEsModule).$exportList[ex] = (this as IEsModule).$components[ex];
      });
    };
  };
}

export function factoryModule(EM: Function): IEsModule {
  const em = new (EM as any)();
  em.$buildImports();
  em.$buildProviderList();
  em.$buildProviders4Services();
  em.$buildComponents4Components();
  em.$buildProviders4Components();
  em.$buildExports();
  return em;
}

// export default EsModule;

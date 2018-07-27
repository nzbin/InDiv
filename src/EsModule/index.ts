import { IUtil, IEsModule, IService } from '../types';

import Utils from '../Utils';

class EsModule implements IEsModule {
  public utils?: IUtil;
  public $imports?: Function[];
  public $components?: {
      [name: string]: Function;
  };
  public $providers?: Function[];
  public $exports?: string[];
  public $exportList?: {
    [name: string]: Function;
  };
  public singletonList?: Map<string, IService>;
  public $bootstrap?: Function;

  constructor() {
    this.utils = new Utils();

    this.$imports = [];
    this.$components = {};
    this.$providers = [];
    this.$exports = [];

    this.$exportList = {};
    this.singletonList = new Map();

    this.$bootstrap = function () {};

    this.$declarations();
    this.$buildImports();
    this.$buildComponents4Components();
    this.$buildProviders4Components();
    this.$buildExports();
  }

  public $declarations(): void {
    this.$imports = [];
    this.$components = {};
    this.$providers = [];
    this.$exports = [];
    this.$bootstrap = function () {};
  }

  public $buildImports(): void {
    if (!this.$imports) return;
    this.$imports.forEach((ModuleImport: any) => {
      const moduleImport = new ModuleImport();
      for (const name in moduleImport.$exportList) {
        this.$components[name] = moduleImport.$exportList[name];
      }
    });
  }

  public $buildProviders4Components(): void {
    if (!this.$providers) return;
    // this.singletonList = this.$providers.map((service: any) => service.getInstance());
    this.$providers.forEach((service: any) => {
      this.singletonList.set(`${service.name.charAt(0).toUpperCase()}${service.name.slice(1)}`, service.getInstance());
      // return service.getInstance();
    });
    for (const name in this.$components) {
      const component: any = this.$components[name];
      if (component._injectedProviders) {
        this.singletonList.forEach((value, key) => {
          if (!component._injectedProviders.has(key)) component._injectedProviders.set(key, value);
          // if (!component._injectedProviders.find(provider => provider.constructor.name === singleton.constructor.name)) component._injectedProviders.push(singleton);
        });
      // if (component._injectedProviders && component._injectedProviders.length > 0) {
        // this.singletonList.forEach(singleton => {
        //   if (!component._injectedProviders.find((s: Service) => s.constructor.name === singleton.constructor.name)) component._injectedProviders.push(singleton);
        // });
      } else {
        component._injectedProviders = this.singletonList;
      }
    }
  }

  public $buildComponents4Components(): void {
    if (!this.$components) return;
    for (const name in this.$components) {
      const FindComponent: any = this.$components[name];
      if (FindComponent._injectedComponents) {
        FindComponent._injectedComponents = Object.assign(FindComponent._injectedComponents, this.$components);
      } else {
        FindComponent._injectedComponents = this.$components;
      }
    }
  }

  public $buildExports(): void {
    if (!this.$exports) return;
    this.$exports.forEach(ex => {
      if (this.$components[ex]) this.$exportList[ex] = this.$components[ex];
    });
  }
}

export default EsModule;

import { INvModule, TInjectTokenProvider, TUseClassProvider, TuseValueProvider } from '../types';

type TNvModuleOptions = {
  imports?: Function[];
  components: Function[];
  providers?: (Function | TUseClassProvider | TuseValueProvider)[];
  exports?: Function[];
  bootstrap?: Function;
};

/**
 * build provider list in module
 * 
 * set Map $providerList in module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviderList(moduleInstance: INvModule): void {
  if (!moduleInstance.$providers) return;
  const length = moduleInstance.$providers.length;
  for (let i = 0; i < length; i++) {
    const service = moduleInstance.$providers[i];
    if ((service as TInjectTokenProvider).provide) {
      if ((service as TUseClassProvider).useClass || (service as TuseValueProvider).useValue) moduleInstance.$providerList.set((service as TInjectTokenProvider).provide, service);
    } else {
      moduleInstance.$providerList.set(service as Function, service as Function);
    }
  }
}

/**
 * build provider list for services in module
 * 
 * set Map $providerList in services
 * 
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviders4Services(moduleInstance: INvModule): void {
  if (!moduleInstance.$providers) return;
  const length = moduleInstance.$providers.length;
  for (let i = 0; i < length; i++) {
    const service: any = moduleInstance.$providers[i];

    if ((service as TInjectTokenProvider).provide) {
      if ((service as TUseClassProvider).useClass) {
        if (!((service as TUseClassProvider).useClass as any)._injectedProviders) ((service as TUseClassProvider).useClass as any)._injectedProviders = new Map();
        moduleInstance.$providerList.forEach((value, key) => {
          if (!((service as TUseClassProvider).useClass as any)._injectedProviders.has(key)) ((service as TUseClassProvider).useClass as any)._injectedProviders.set(key, value);
        });
      }
    } else {
      if (!service._injectedProviders) service._injectedProviders = new Map();
      moduleInstance.$providerList.set(service as Function, service as Function);
    }
  }
}

/**
 * build provider list for component in module
 * 
 * set Map _injectedProviders in component
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviders4Components(moduleInstance: INvModule): void {
  if (!moduleInstance.$providers || !moduleInstance.$components) return;
  const length = moduleInstance.$components.length;
  for (let i = 0; i < length; i++) {
    const FindComponent: any = moduleInstance.$components[i];
    if (!FindComponent._injectedProviders) FindComponent._injectedProviders = new Map();
    moduleInstance.$providerList.forEach((value, key) => {
      if (!FindComponent._injectedProviders.has(key)) FindComponent._injectedProviders.set(key, value);
    });
  }
}

/**
 * build provider list for component in module
 * 
 * set Map _injectedComponents in component
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildComponents4Components(moduleInstance: INvModule): void {
  if (!moduleInstance.$components) return;
  const length = moduleInstance.$components.length;
  for (let i = 0; i < length; i++) {
    const FindComponent: any = moduleInstance.$components[i];
    if (!FindComponent._injectedComponents) FindComponent._injectedComponents = new Map();
    moduleInstance.$components.forEach((needInjectComponent: any) => {
      if (!FindComponent._injectedComponents.has(needInjectComponent.$selector)) FindComponent._injectedComponents.set(needInjectComponent.$selector, needInjectComponent);
    });
  }
}

/**
 * build $imports for module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildImports(moduleInstance: INvModule): void {
  if (!moduleInstance.$imports) return;
  const length = moduleInstance.$imports.length;
  for (let i = 0; i < length; i++) {
    const ModuleImport = moduleInstance.$imports[i];
    const moduleImport = factoryModule(ModuleImport);
    const exportsLength = moduleImport.$exportsList.length;
    for (let i = 0; i < exportsLength; i++) {
      const exportFromModule = moduleImport.$exportsList[i];
      if (!moduleInstance.$components.find((component: any) => component.$selector === (exportFromModule as any).$selector)) moduleInstance.$components.push(exportFromModule);
    }
  }
}

/**
 * build $exportsList for module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildExports(moduleInstance: INvModule): void {
  if (!moduleInstance.$exports) return;
  const length = moduleInstance.$exports.length;
  for (let i = 0; i < length; i++) {
    const ModuleExport = moduleInstance.$exports[i];
    // 如果导出的是模块
    if ((ModuleExport as any).nvType === 'nvModule') {
      const moduleInstanceOfExport = factoryModule(ModuleExport);
      // 被导出的模块中的导出
      const moduleInstanceOfExportLength = moduleInstanceOfExport.$exportsList.length;
      for (let j = 0; j < moduleInstanceOfExportLength; j++) {
        const moduleExportFromModuleOfExport = moduleInstanceOfExport.$exportsList[j];
        if (!moduleInstance.$exportsList.find((component: any) => component.$selector === (moduleExportFromModuleOfExport as any).$selector)) moduleInstance.$exportsList.push(moduleExportFromModuleOfExport);
      }
    }
    // 如果导出的是组件
    if ((ModuleExport as any).nvType !== 'nvModule') {
      if (!moduleInstance.$exportsList.find((component: any) => component.$selector === (ModuleExport as any).$selector)) moduleInstance.$exportsList.push(ModuleExport);
    }
  }
}

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
    (_constructor as any).nvType = 'nvModule';
    const vm = _constructor.prototype as INvModule;
    vm.$providerList = new Map();
    vm.$providerInstances = new Map();
    if (options.imports) vm.$imports = options.imports;
    if (options.components) vm.$components = options.components;
    if (options.providers) vm.$providers = options.providers;
    if (options.exports) {
      vm.$exports = options.exports;
      vm.$exportsList = [];
    }
    if (options.bootstrap) vm.$bootstrap = options.bootstrap;
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
  const moduleInstance = new (NM as any)();
  buildProviderList(moduleInstance);
  buildProviders4Services(moduleInstance);
  buildComponents4Components(moduleInstance);
  buildProviders4Components(moduleInstance);
  buildImports(moduleInstance);
  buildExports(moduleInstance);
  return moduleInstance;
}

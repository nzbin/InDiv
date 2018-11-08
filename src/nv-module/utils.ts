import { INvModule, TInjectTokenProvider, TUseClassProvider, TuseValueProvider } from '../types';

import { factoryCreator } from '../di';

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
    // build exports
    const exportsLength = moduleImport.$exportsList.length;
    for (let i = 0; i < exportsLength; i++) {
      const exportFromModule = moduleImport.$exportsList[i];
      if (!moduleInstance.$components.find((component: any) => component.$selector === (exportFromModule as any).$selector)) moduleInstance.$components.push(exportFromModule);
    }
    // export providerList
    if (moduleImport.$providerList) {
      moduleImport.$providerList.forEach((value, key) => {
        if (!moduleInstance.$providerList.has(key)) moduleInstance.$providerList.set(key, value);
      });
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
 * create an NvModule instance with factory method
 * 
 * first build service and components in Function.prototype
 * then use factoryCreator create and NvModule instance
 *
 * @export
 * @param {Function} NM
 * @returns {INvModule}
 */
export function factoryModule(NM: Function): INvModule {
  buildProviderList(NM.prototype);
  buildComponents4Components(NM.prototype);
  buildImports(NM.prototype);
  buildExports(NM.prototype);
  return factoryCreator(NM, NM.prototype);
}

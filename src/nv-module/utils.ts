import { IInDiv, INvModule, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

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
      if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) moduleInstance.$providerList.set((service as TInjectTokenProvider).provide, service);
    } else {
      moduleInstance.$providerList.set(service as Function, service as Function);
    }
  }
}

/**
 * build provider list for declaration in module
 * 
 * set Map _injectedDeclarationss in declaration
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildDeclarations4Declarations(moduleInstance: INvModule): void {
  if (!moduleInstance.$declarations) return;
  const length = moduleInstance.$declarations.length;
  for (let i = 0; i < length; i++) {
    const FindComponent: any = moduleInstance.$declarations[i];
    if (!FindComponent._injectedDeclarations) FindComponent._injectedDeclarations = new Map();
    moduleInstance.$declarations.forEach((needInjectComponent: any) => {
      if (!FindComponent._injectedDeclarations.has(needInjectComponent.$selector)) FindComponent._injectedDeclarations.set(needInjectComponent.$selector, needInjectComponent);
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
    // push InDiv instance
    const moduleImport = factoryModule(ModuleImport, moduleInstance.$indivInstance);
    // build exports
    if (moduleImport.$exportsList) {
      const exportsLength = moduleImport.$exportsList.length;
      for (let i = 0; i < exportsLength; i++) {
        const exportFromModule = moduleImport.$exportsList[i];
        if (!moduleInstance.$declarations.find((component: any) => component.$selector === (exportFromModule as any).$selector)) moduleInstance.$declarations.push(exportFromModule);
      }
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
      const moduleInstanceOfExport = factoryModule(ModuleExport, moduleInstance.$indivInstance);
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
export function factoryModule(NM: Function, indivInstance?: IInDiv): INvModule {
  NM.prototype.$indivInstance = indivInstance;
  buildProviderList(NM.prototype);
  buildDeclarations4Declarations(NM.prototype);
  buildImports(NM.prototype);
  buildExports(NM.prototype);
  return factoryCreator(NM, NM.prototype);
}

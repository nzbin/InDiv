import { IInDiv, INvModule, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { factoryCreator, factoryCreator2, rootInjector, Injector } from '../di';
import { InDiv } from '../indiv';

/**
 * build provider list in module
 * 
 * set Map $providerList in module
 *
 * @param {INvModule} moduleInstance
 * @param {Injector} otherInjector
 * @returns {void}
 */
function buildProviderList(moduleInstance: INvModule, otherInjector?: Injector): void {
  if (!moduleInstance.$providers) return;
  const injector = otherInjector ? otherInjector : rootInjector;
  const length = moduleInstance.$providers.length;
  for (let i = 0; i < length; i++) {
    const service = moduleInstance.$providers[i];
    if ((service as TInjectTokenProvider).provide) {
      if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) moduleInstance.$providerList.set((service as TInjectTokenProvider).provide, service);
      if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) injector.setProvider((service as TInjectTokenProvider).provide, service);
    } else {
      moduleInstance.$providerList.set(service as Function, service as Function);
      injector.setProvider(service as Function, service as Function);
    }
  }
}

/**
 * build $imports for module
 *
 * @param {INvModule} moduleInstance
 * @param {IInDiv} [indivInstance]
 * @param {Injector} [otherInjector]
 * @returns {void}
 */
function buildImports(moduleInstance: INvModule, indivInstance?: IInDiv, otherInjector?: Injector): void {
  if (!moduleInstance.$imports) return;
  const injector = otherInjector ? otherInjector : rootInjector;
  const length = moduleInstance.$imports.length;
  for (let i = 0; i < length; i++) {
    const ModuleImport = moduleInstance.$imports[i];
    // push InDiv instance
    // const moduleImport = factoryModule(ModuleImport, indivInstance);
    const moduleImport = factoryModule2(ModuleImport, otherInjector, indivInstance);
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
        if (!injector.getProvider(key)) injector.setProvider(key, value);
      });
    }
  }
}

/**
 * build provider list for declaration in module
 * 
 * set static $declarations: [] in declaration
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildDeclarations4Declarations(moduleInstance: INvModule): void {
  if (!moduleInstance.$declarations) return;
  const length = moduleInstance.$declarations.length;
  for (let i = 0; i < length; i++) {
    const FindDeclaration: any = moduleInstance.$declarations[i];
    moduleInstance.$declarations.forEach((needInjectDeclaration: any) => {
      if (!FindDeclaration.prototype.$declarationMap.has(needInjectDeclaration.$selector)) FindDeclaration.prototype.$declarationMap.set(needInjectDeclaration.$selector, needInjectDeclaration);
    });
  }
}

/**
 * build $exportsList for module
 *
 * @param {INvModule} moduleInstance
 * @param {IInDiv} [indivInstance]
 * @param {Injector} [otherInjector]
 * @returns {void}
 */
function buildExports(moduleInstance: INvModule, indivInstance?: IInDiv, otherInjector?: Injector): void {
  if (!moduleInstance.$exports) return;
  const length = moduleInstance.$exports.length;
  for (let i = 0; i < length; i++) {
    const ModuleExport = moduleInstance.$exports[i];
    // 如果导出的是模块
    if ((ModuleExport as any).nvType === 'nvModule') {
      // const moduleInstanceOfExport = factoryModule(ModuleExport, indivInstance);
      const moduleInstanceOfExport = factoryModule2(ModuleExport, otherInjector, indivInstance);
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
 * @param {IInDiv} [indivInstance]
 * @returns {INvModule}
 */
export function factoryModule(NM: Function, indivInstance?: IInDiv): INvModule {
  const internalDependence = new Map();
  if (indivInstance) internalDependence.set(InDiv, indivInstance);
  buildProviderList(NM.prototype);
  buildImports(NM.prototype, indivInstance);
  buildDeclarations4Declarations(NM.prototype);
  buildExports(NM.prototype, indivInstance);
  return factoryCreator(NM, NM.prototype, null, internalDependence);
}
// todo
export function factoryModule2(NM: Function, otherInjector?: Injector, indivInstance?: IInDiv): INvModule {
  console.log(88888, NM, otherInjector);
  const internalDependence = new Map();
  if (indivInstance) internalDependence.set(InDiv, indivInstance);
  buildProviderList(NM.prototype, otherInjector);
  buildImports(NM.prototype, indivInstance, otherInjector);
  buildDeclarations4Declarations(NM.prototype);
  buildExports(NM.prototype, indivInstance, otherInjector);
  return factoryCreator2(NM, otherInjector, internalDependence);
}

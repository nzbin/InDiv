import { INvModule, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';
import { factoryCreator, rootInjector, Injector } from '../di';

/**
 * get NvModule instance from rootInjector
 *
 * use this method get NvModule instance, if want to get it from rootInjector as singleton instance
 * 
 * @export
 * @param {Function} FindNvModule
 * @param {Injector} [otherInjector]
 * @returns {INvModule}
 */
export function getModuleFromRootInjector(FindNvModule: Function, otherInjector?: Injector): INvModule {
  let moduleFound: INvModule;
  if (!rootInjector.getInstance(FindNvModule)) {
    moduleFound = factoryModule(FindNvModule, otherInjector);
    rootInjector.setInstance(FindNvModule, moduleFound);
  } else moduleFound = rootInjector.getInstance(FindNvModule);
  return moduleFound;
}

/**
 * build provider list in module
 * 
 * otherInjector first
 * rootInjector second
 *
 * @param {INvModule} moduleInstance
 * @param {Injector} otherInjector
 * @returns {void}
 */
function buildProviderList(moduleInstance: INvModule, otherInjector?: Injector): void {
  if (!moduleInstance.providers) return;
  const injector = otherInjector ? otherInjector : rootInjector;
  const length = moduleInstance.providers.length;
  for (let i = 0; i < length; i++) {
    const service = moduleInstance.providers[i];
    if ((service as TInjectTokenProvider).provide) {
      if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) injector.setProvider((service as TInjectTokenProvider).provide, service);
    } else {
      injector.setProvider(service as Function, service as Function);
    }
  }
}

/**
 * build imports for module
 * 
 * otherInjector first
 * rootInjector second
 *
 * @param {INvModule} moduleInstance
 * @param {Injector} [otherInjector]
 * @returns {void}
 */
function buildImports(moduleInstance: INvModule, otherInjector?: Injector): void {
  if (!moduleInstance.imports) return;
  const length = moduleInstance.imports.length;
  for (let i = 0; i < length; i++) {
    const ModuleImport = moduleInstance.imports[i];
    // push InDiv instance
    const moduleImport = getModuleFromRootInjector(ModuleImport, otherInjector);
    // build exports
    if (moduleImport.exportsList) {
      const exportsLength = moduleImport.exportsList.length;
      for (let i = 0; i < exportsLength; i++) {
        const exportFromModule = moduleImport.exportsList[i];
        if (moduleInstance.declarations && !moduleInstance.declarations.find((declaration: any) => declaration.selector === (exportFromModule as any).selector)) moduleInstance.declarations.push(exportFromModule);
      }
    }
  }
}

/**
 * build provider list for declaration in module
 * 
 * set static declarations: [] in declaration
 *
 * otherInjector first
 * rootInjector second
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildDeclarations4Declarations(moduleInstance: INvModule): void {
  if (!moduleInstance.declarations) return;
  const length = moduleInstance.declarations.length;
  for (let i = 0; i < length; i++) {
    const FindDeclaration: any = moduleInstance.declarations[i];
    moduleInstance.declarations.forEach((needInjectDeclaration: any) => {
      if (!FindDeclaration.prototype.declarationMap.has(needInjectDeclaration.selector)) FindDeclaration.prototype.declarationMap.set(needInjectDeclaration.selector, needInjectDeclaration);
    });
  }
}

/**
 * build exportsList for module
 *
 * @param {INvModule} moduleInstance
 * @param {Injector} [otherInjector]
 * @returns {void}
 */
function buildExports(moduleInstance: INvModule, otherInjector?: Injector): void {
  if (!moduleInstance.exports) return;
  const length = moduleInstance.exports.length;
  for (let i = 0; i < length; i++) {
    const ModuleExport = moduleInstance.exports[i];
    // if export is NvModule, exports from NvModule will be exported again from this module
    if ((ModuleExport as any).nvType === 'nvModule') {
      const moduleInstanceOfExport = getModuleFromRootInjector(ModuleExport, otherInjector);
      const moduleInstanceOfExportLength = moduleInstanceOfExport.exportsList.length;
      for (let j = 0; j < moduleInstanceOfExportLength; j++) {
        const moduleExportFromModuleOfExport = moduleInstanceOfExport.exportsList[j];
        if (!moduleInstance.exportsList.find((declaration: any) => declaration.selector === (moduleExportFromModuleOfExport as any).selector)) moduleInstance.exportsList.push(moduleExportFromModuleOfExport);
      }
    }

    if ((ModuleExport as any).nvType !== 'nvModule') {
      if (!moduleInstance.exportsList.find((declaration: any) => declaration.selector === (ModuleExport as any).selector)) moduleInstance.exportsList.push(ModuleExport);
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
 * @param {Injector} [otherInjector]
 * @returns {INvModule}
 */
export function factoryModule(NM: Function, otherInjector?: Injector): INvModule {
  const provideAndInstanceMap = new Map();
  buildProviderList(NM.prototype, otherInjector);
  buildImports(NM.prototype, otherInjector);
  buildDeclarations4Declarations(NM.prototype);
  buildExports(NM.prototype, otherInjector);
  return factoryCreator(NM, otherInjector, provideAndInstanceMap);
}

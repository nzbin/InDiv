import { INvModule, TUseClassProvider, TUseValueProvider } from '../types';
import { injected, Injector, rootInjector } from '../di';

export type TNvModuleOptions = {
  imports?: Function[];
  declarations?: Function[];
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
  exports?: Function[];
  bootstrap?: Function;
};

/**
 * Decorator @NvModule
 * 
 * to decorate an InDiv NvModule
 * @NvModule is injectable, and will be injected in rootInjector
 * you can use NvModule as injectable token to get singleton instance of @NvModule in constructor
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function NvModule(options: TNvModuleOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).nvType = 'nvModule';
    const vm = _constructor.prototype as INvModule;
    vm.privateInjector = new Injector();
    vm.providers = [];
    if (options.imports) vm.imports = options.imports;
    if (options.declarations) vm.declarations = options.declarations;
    if (options.providers) vm.providers = vm.providers.concat(options.providers);
    if (options.exports) {
      vm.exports = options.exports;
      vm.exportsList = [];
    }
    if (options.bootstrap) vm.bootstrap = options.bootstrap;
    rootInjector.setProvider(_constructor, _constructor);
  };
}

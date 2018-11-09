import { INvModule, TUseClassProvider, TUseValueProvider } from '../types';

export { factoryModule } from './utils';

type TNvModuleOptions = {
  imports?: Function[];
  components?: Function[];
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
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

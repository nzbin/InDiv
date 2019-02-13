import { IDirective, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';
import { injected, Injector, rootInjector } from '../di';

export type TDirectiveOptions = {
  selector: string;
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};

/**
 * Decorator @Directive
 * 
 * to decorate an InDiv Directive
 *
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function Directive(options: TDirectiveOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).isSingletonMode = false;
    rootInjector.setProvider(_constructor, _constructor);
    (_constructor as any).nvType = 'nvDirective';
    (_constructor as any).selector = options.selector;
    const vm: IDirective = _constructor.prototype;

    vm.privateInjector = new Injector();
    if (options.providers && options.providers.length > 0) {
      const length = options.providers.length;
      for (let i = 0; i < length; i++) {
        const service = options.providers[i];
        if ((service as TInjectTokenProvider).provide) {
          if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) vm.privateInjector.setProvider((service as TInjectTokenProvider).provide, service);
        } else {
          vm.privateInjector.setProvider(service as Function, service as Function);
        }
      }
    }

    vm.declarationMap = new Map();
  };
}


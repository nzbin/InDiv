import { IDirective, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { injected, Injector } from '../di';

type TDirectiveOptions = {
  selector: string;
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};

/**
 * Decorator @Directive
 * 
 * to decorate an InDiv Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function Directive<Props = any, Vm = any>(options: TDirectiveOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).nvType = 'nvDirective';
    (_constructor as any).$selector = options.selector;
    const vm: IDirective<Props, Vm> = _constructor.prototype;

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

    vm.$declarationMap = new Map();
  };
}


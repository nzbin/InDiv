import { IComponent, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { Utils } from '../utils';
import { injected } from '../di/injected';

type TDirectiveOptions = {
  selector: string;
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};

const utils = new Utils();

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
    (_constructor as any)._injectedDeclarations = new Map();
    const vm: any = _constructor.prototype;

    // component $providerList for injector
    if (options.providers && options.providers.length > 0) {
      vm.$providerList = new Map();
      const length = options.providers.length;
      for (let i = 0; i < length; i++) {
        const service = options.providers[i];
        if ((service as TInjectTokenProvider).provide) {
          if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) vm.$providerList.set((service as TInjectTokenProvider).provide, service);
        } else {
          vm.$providerList.set(service as Function, service as Function);
        }
      }
    }

    vm.$declarations = [];
  };
}


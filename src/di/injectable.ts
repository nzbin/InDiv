import { injected } from './injected';
import { rootInjector, Injector } from './injector';

interface Type<T> extends Function {
  new (...args: any[]): T;
}

type TInjectableOptions = {
  isSingletonMode?: boolean;
  providedIn?: Type<any> | 'root' | null;
};

/**
 * Decorator @Injectable
 * 
 * to decorate an InDiv Service
 * 
 * options Object has two key-values:
 * 1. isSingletonMode?: boolean; To show InDiv this service is a singleton service or not. Defalut value is true.
 * 2. providedIn?: Type<any> | 'root' | null;
 *   If is NvModule, to show InDiv this service can be injected in which NvModule's privateInjector.PrivateInjector is always used in LazyLoad Module.
 *   if is 'root', it will be injected into rootInjector.
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
export function Injectable(options?: TInjectableOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
      injected(_constructor);
      (_constructor as any).isSingletonMode = true;
      if (options && options.isSingletonMode === false) (_constructor as any).isSingletonMode = false;
      if (options && options.providedIn) {
        if (options.providedIn === 'root') rootInjector.setProvider(_constructor, _constructor);
        // todo can't use value
        // else ((options.providedIn as Type<any>).prototype.privateInjector as Injector).setProvider(_constructor, _constructor);
      }
  };
}

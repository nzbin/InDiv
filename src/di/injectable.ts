import { injected } from './injected';

type TInjectableOptions = {
  isSingletonMode?: boolean;
};

/**
 * Decorator @Injectable
 * 
 * to decorate an InDiv Service
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
export function Injectable(options?: TInjectableOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
      injected(_constructor);
      (_constructor as any).isSingletonMode = true;
      if (options) (_constructor as any).isSingletonMode = options.isSingletonMode;
  };
}

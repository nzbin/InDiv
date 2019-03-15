import { TInjectTokenProvider, TUseClassProvider, TUseValueProvider, TProviders, TProvider } from '../types';
import { Injector } from './injector';

/**
 * build a private injector with providers
 *
 * @export
 * @param {TProviders} providers
 * @returns {voInjectorid}
 */
export function buildPrivateInjector(providers: TProviders): Injector {
  const privateInjector = new Injector();
  if (providers && providers.length > 0) {
    const length = providers.length;
    for (let i = 0; i < length; i++) {
      const service = providers[i];
      if ((service as TInjectTokenProvider).provide) {
        if ((service as TUseClassProvider).useClass || (service as TUseValueProvider).useValue) privateInjector.setProvider((service as TInjectTokenProvider).provide, service);
      } else {
        privateInjector.setProvider(service as Function, service as Function);
      }
    }
  }
  return privateInjector;
}

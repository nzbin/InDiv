import { IComponent, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { WatcherDependences } from './watch';
import { injected, Injector, rootInjector } from '../di';
import { collectDependencesFromViewModel } from './utils';
import { componentCompiler } from '../compile';

export type TComponentOptions = {
  selector: string;
  template: string;
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};

/**
 * Decorator @Component
 * 
 * to decorate an InDiv component
 * render function comes from InDiv instance, you can set it by youself
 * 
 * watchStatus: 'pending' | 'available', to controll watcher and render will be called or not in dependencesList
 *
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function Component(options: TComponentOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).isSingletonMode = false;
    rootInjector.setProvider(_constructor, _constructor);
    (_constructor as any).nvType = 'nvComponent';
    (_constructor as any).selector = options.selector;
    const vm: IComponent = _constructor.prototype;
    vm.template = options.template;

    vm.watchStatus = 'available';
    vm.isWaitingRender = false;

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
    // for Component
    vm.componentList = [];
    // for Directive
    vm.directiveList = [];

    vm.watchData = function (): void {
      if (!(this as IComponent).dependencesList) (this as IComponent).dependencesList = [];
      collectDependencesFromViewModel(this);
      (this as IComponent).dependencesList.forEach(dependence => WatcherDependences(this, dependence));
    };

    vm.render = function (): Promise<IComponent> {
      const nativeElement = (this as IComponent).nativeElement;
      return Promise.resolve().then(() => {
        return (this as IComponent).compiler(nativeElement, this);
      });
    };
    vm.compiler = componentCompiler;
  };
}

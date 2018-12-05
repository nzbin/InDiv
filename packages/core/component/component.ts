import { IComponent, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { Watcher } from '../watcher';
import { injected, Injector } from '../di';
import { render } from '../render';
import { collectDependencesFromViewModel } from './utils';

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
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export function Component<State = any, Props = any, Vm = any>(options: TComponentOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).nvType = 'nvComponent';
    (_constructor as any).selector = options.selector;
    const vm: IComponent<State, Props, Vm> = _constructor.prototype;
    vm.template = options.template;

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
      // todo add @watch in dependences
      (this as IComponent).dependencesList = collectDependencesFromViewModel(this.template, this);
      if (this.state) {
        if ((this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, (this as IComponent<State, Props, Vm>).nvWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).render.bind(this as IComponent<State, Props, Vm>));
        if (!(this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, null, (this as IComponent<State, Props, Vm>).render.bind(this as IComponent<State, Props, Vm>));
      }
    };

    vm.render = render;
  };
}

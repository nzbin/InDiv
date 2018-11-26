import { IComponent, TInjectTokenProvider, TUseClassProvider, TUseValueProvider } from '../types';

import { Watcher } from '../watcher';
import { Utils } from '../utils';
import { injected } from '../di/injected';

type TComponentOptions = {
  selector: string;
  template: string;
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};

const utils = new Utils();

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
    (_constructor as any).$selector = options.selector;
    const vm: IComponent<State, Props, Vm> = _constructor.prototype;
    vm.$template = options.template;

    // Component $providerList for injector
    vm.$providerList = new Map();
    vm.$providerList.set(setState, { provide: setState, useValue: setState });
    if (options.providers && options.providers.length > 0) {
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

    vm.$declarationMap = new Map();
    // for Component
    vm.$componentList = [];
    // for Directive
    vm.$directiveList = [];

    vm.watchData = function (): void {
      if (this.state) {
        if ((this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, (this as IComponent<State, Props, Vm>).nvWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).reRender.bind(this as IComponent<State, Props, Vm>));
        if (!(this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, null, (this as IComponent<State, Props, Vm>).reRender.bind(this as IComponent<State, Props, Vm>));
      }
    };
  };
}

export type SetState = (newState: any) => void;

export function setState(newState: any): void {
  if (newState && utils.isFunction(newState)) {
    const _newState = newState();
    if (_newState && _newState instanceof Object) {
      if (utils.isEqual(this.state, _newState)) return;
      const _state = JSON.parse(JSON.stringify(this.state));
      Object.assign(_state, _newState);
      this.state = _state;
      if ((this as any).nvWatchState) (this as any).stateWatcher = new Watcher((this as any).state, (this as any).nvWatchState.bind(this as any), (this as any).reRender.bind(this as any));
      if (!(this as any).nvWatchState) (this as any).stateWatcher = new Watcher((this as any).state, null, (this as any).reRender.bind(this as any));
      (this as any).reRender();
    }
  }
  if (newState && newState instanceof Object) {
    if (utils.isEqual(this.state, newState)) return;
    const _state = JSON.parse(JSON.stringify(this.state));
    Object.assign(_state, newState);
    this.state = _state;
    if ((this as any).nvWatchState) (this as any).stateWatcher = new Watcher((this as any).state, (this as any).nvWatchState.bind(this as any), (this as any).reRender.bind(this as any));
    if (!(this as any).nvWatchState) (this as any).stateWatcher = new Watcher((this as any).state, null, (this as any).reRender.bind(this as any));
    (this as any).reRender();
  }
}

import { IComponent, ComponentList, TInjectTokenProvider, TUseClassProvider, TuseValueProvider } from '../types';

import Compile from '../Compile';
import Watcher from '../Watcher';
import Utils from '../Utils';
import { CompileUtil, CompileUtilForRepeat } from '../CompileUtils';
import { factoryCreator } from '../DI';


type TComponentOptions = {
  selector: string;
  template: string;
  providers?: (Function | TUseClassProvider | TuseValueProvider)[];
};

const utils = new Utils();

/**
 * Decorator @Component
 * 
 * to decorate an InDiv component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
function Component<State = any, Props = any, Vm = any>(options: TComponentOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    (_constructor as any).$selector = options.selector;
    const vm: IComponent<State, Props, Vm> = _constructor.prototype;
    vm.$template = options.template;

    // component $providerList for injector
    if (options.providers && options.providers.length > 0) {
      vm.$providerList = new Map();
      const length = options.providers.length;
      for (let i = 0; i < length; i++) {
        const service = options.providers[i];
        if ((service as TInjectTokenProvider).provide) {
          if ((service as TUseClassProvider).useClass || (service as TuseValueProvider).useValue) vm.$providerList.set((service as TInjectTokenProvider).provide, service);
        } else {
          vm.$providerList.set(service as Function, service as Function);
        }
      }
    }

    vm.compileUtil = new CompileUtil();
    vm.$components = [];
    vm.$componentList = [];

    vm.getLocation = function (): {
      path?: string;
      query?: any;
      params?: any;
      data?: any;
    } {
      if (!utils.isBrowser()) return {};
      return {
        path: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.path,
        query: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.query,
        params: (this as IComponent<State, Props, Vm>).$vm.$esRouteParmasObject,
        data: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.data,
      };
    };

    vm.setLocation = function (path: string, query?: any, data?: any, title?: string): void {
      if (!utils.isBrowser()) return;
      const rootPath = (this as IComponent<State, Props, Vm>).$vm.$rootPath === '/' ? '' : (this as IComponent<State, Props, Vm>).$vm.$rootPath;
      history.pushState(
        { path, query, data },
        title,
        `${rootPath}${path}${utils.buildQuery(query)}`,
      );
      (this as IComponent<State, Props, Vm>).$vm.$esRouteObject = { path, query, data };
    };

    vm.watchData = function (): void {
      if (this.state) {
        if ((this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, (this as IComponent<State, Props, Vm>).nvWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).reRender.bind(this as IComponent<State, Props, Vm>));
        if (!(this as IComponent<State, Props, Vm>).nvWatchState) (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, null, (this as IComponent<State, Props, Vm>).reRender.bind(this as IComponent<State, Props, Vm>));
      }
    };

    vm.render = function () {
      const dom = (this as IComponent<State, Props, Vm>).renderDom;
      const compile = new Compile(dom, this as IComponent<State, Props, Vm>);
      (this as IComponent<State, Props, Vm>).mountComponent(dom);
      const length = (this as IComponent<State, Props, Vm>).$componentList.length;
      for (let i = 0; i < length; i++) {
        const component = (this as IComponent<State, Props, Vm>).$componentList[i];
        if (component.scope.render) component.scope.render();
        if (component.scope.nvAfterMount) component.scope.nvAfterMount();
      }
      if (this.nvHasRender) this.nvHasRender();
    };

    vm.reRender = function (): void {
      const dom = (this as IComponent<State, Props, Vm>).renderDom;
      const routerRenderDom = dom.querySelectorAll((this as IComponent<State, Props, Vm>).$vm.$routeDOMKey)[0];
      const compile = new Compile(dom, (this as IComponent<State, Props, Vm>), routerRenderDom);
      (this as IComponent<State, Props, Vm>).mountComponent(dom);
      const length = (this as IComponent<State, Props, Vm>).$componentList.length;
      for (let i = 0; i < length; i++) {
        const component = (this as IComponent<State, Props, Vm>).$componentList[i];
        if (component.scope.render) component.scope.reRender();
        if (component.scope.nvAfterMount) component.scope.nvAfterMount();
      }
      if ((this as IComponent<State, Props, Vm>).nvHasRender) (this as IComponent<State, Props, Vm>).nvHasRender();
    };

    vm.mountComponent = function (dom: Element): void {
      const cacheStates: ComponentList<IComponent<State, Props, Vm>>[] = [ ...(this as IComponent<State, Props, Vm>).$componentList ];
      (this as IComponent<State, Props, Vm>).componentsConstructor(dom);
      const componentListLength = (this as IComponent<State, Props, Vm>).$componentList.length;
      for (let i = 0; i < componentListLength; i ++) {
        const component = (this as IComponent<State, Props, Vm>).$componentList[i];
        // find Component from cache
        const cacheComponentIndex = cacheStates.findIndex(cache => cache.dom === component.dom);
        const cacheComponent = cacheStates[cacheComponentIndex];

        // clear cache and the rest need to be destoried
        if (cacheComponentIndex !== -1) cacheStates.splice(cacheComponentIndex, 1);
        if (cacheComponent) {
          component.scope = cacheComponent.scope;
          // old props: component.scope.props
          // new props: component.props
          if (!utils.isEqual(component.scope.props, component.props)) {
            if (component.scope.nvReceiveProps) component.scope.nvReceiveProps(component.props);
            component.scope.props = component.props;
          }
        }

        component.scope.$vm = (this as IComponent<State, Props, Vm>).$vm;
        component.scope.$components = (this as IComponent<State, Props, Vm>).$components;
        if (component.scope.nvOnInit && !cacheComponent) component.scope.nvOnInit();
        if (component.scope.watchData) component.scope.watchData();
        if (component.scope.nvBeforeMount) component.scope.nvBeforeMount();
      }
      // the rest should use nvOnDestory
      const cacheStatesLength = cacheStates.length;
      for (let i = 0; i < cacheStatesLength; i ++) {
        const cache = cacheStates[i];
        if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
      }
    };

    vm.componentsConstructor = function (dom: Element): void {
      (this as IComponent<State, Props, Vm>).$componentList = [];
      const routerRenderDom = dom.querySelectorAll((this as IComponent<State, Props, Vm>).$vm.$routeDOMKey)[0];
      const injectedComponentsLength = ((this as IComponent<State, Props, Vm>).constructor as any)._injectedComponents.length;
      for (let i = 0; i < injectedComponentsLength; i++) {
        const injectedComponent = ((this as IComponent<State, Props, Vm>).constructor as any)._injectedComponents[i];
        if (!(this as IComponent<State, Props, Vm>).$components.find((component: any) => component.$selector === injectedComponent.$selector)) (this as IComponent<State, Props, Vm>).$components.push(injectedComponent);
      }
      const componentsLength = (this as IComponent<State, Props, Vm>).$components.length;
      for (let i = 0; i < componentsLength; i++) {
        const name = (((this as IComponent<State, Props, Vm>).$components[i]) as any).$selector;
        const tags = dom.getElementsByTagName(name);
        Array.from(tags).forEach(node => {
          //  protect component in <router-render>
          if (routerRenderDom && routerRenderDom.contains(node)) return;

          const nodeAttrs = node.attributes;
          const props: any = {};

          if (nodeAttrs) {
            const attrList = Array.from(nodeAttrs);
            const _propsKeys: any = {};

            attrList.forEach((attr: any) => {
              if (/^\_prop\-(.+)/.test(attr.name)) {
                _propsKeys[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
                node.removeAttribute(attr.name);
              }
            });

            attrList.forEach((attr: any) => {
              const attrName = attr.name;

              if ((/^\_prop\-(.+)/.test(attr.name))) return;

              const prop = /^\{(.+)\}$/.exec(attr.value);
              if (prop) {
                const valueList = prop[1].split('.');
                const key = valueList[0];
                let _prop = null;
                if (/^(state.).*/g.test(prop[1])) {
                  _prop = (this as IComponent<State, Props, Vm>).compileUtil._getVMVal(this as IComponent<State, Props, Vm>, prop[1]);
                  props[attrName] = (this as IComponent<State, Props, Vm>).buildProps(_prop);
                  return;
                }
                if (/^(\@.).*\(.*\)$/g.test(prop[1])) {
                  const utilVm = new CompileUtilForRepeat();
                  const fn = utilVm._getVMFunction(vm, prop[1]);
                  const args = prop[1].replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
                  const argsList: any[] = [];
                  args.forEach(arg => {
                    if (arg === '') return false;
                    if (arg === '$element') return argsList.push(node);
                    if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
                    if (/(state.).*/g.test(arg)) return argsList.push(utilVm._getVMVal(vm, arg));
                    if (/\'.*\'/g.test(arg)) return argsList.push(arg.match(/\'(.*)\'/)[1]);
                    if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
                    if (node.repeatData) {
                      // $index in this
                      Object.keys(node.repeatData).forEach(data => {
                        if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
                      });
                    }
                  });
                  const value = fn.apply(vm, argsList);
                  props[attrName] = value;
                  return;
                }
                if (/^(\@.).*[^\(.*\)]$/g.test(prop[1])) {
                  _prop = (this as IComponent<State, Props, Vm>).compileUtil._getVMVal(this as IComponent<State, Props, Vm>, prop[1].replace(/^(\@)/, ''));
                  props[attrName] = (this as IComponent<State, Props, Vm>).buildProps(_prop);
                  return;
                }
                if (_propsKeys.hasOwnProperty(key)) {
                  _prop = (this as IComponent<State, Props, Vm>).getPropsValue(valueList, _propsKeys[key]);
                  props[attrName] = (this as IComponent<State, Props, Vm>).buildProps(_prop);
                  return;
                }
                if (node.repeatData && node.repeatData[key] !== null) {
                  _prop = (this as IComponent<State, Props, Vm>).compileUtil._getValueByValue(node.repeatData[key], prop[1], key);
                  props[attrName] = (this as IComponent<State, Props, Vm>).buildProps(_prop);
                  return;
                }
              }

              // can't remove indiv_repeat_key
              if (attr.name !== 'indiv_repeat_key')  node.removeAttribute(attrName);
            });
          }

          (this as IComponent<State, Props, Vm>).$componentList.push({
            dom: node,
            props,
            scope: (this as IComponent<State, Props, Vm>).buildComponentScope((this as IComponent<State, Props, Vm>).$components[i], props, node),
          });
        });
      }
    };

    vm.setState = function (newState: any): void {
      if (newState && utils.isFunction(newState)) {
        const _newState = newState();
        if (_newState && _newState instanceof Object) {
          for (const key in _newState) {
            if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== _newState[key]) (this as IComponent<State, Props, Vm>).state[key] = _newState[key];
            if (!(this as IComponent<State, Props, Vm>).state.hasOwnProperty(key)) (this as IComponent<State, Props, Vm>).state[key] = _newState[key];
          }
          (this as IComponent<State, Props, Vm>).reRender();
        }
      }
      if (newState && newState instanceof Object) {
        for (const key in newState) {
          if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== newState[key]) (this as IComponent<State, Props, Vm>).state[key] = newState[key];
          if (!(this as IComponent<State, Props, Vm>).state.hasOwnProperty(key)) (this as IComponent<State, Props, Vm>).state[key] = newState[key];
        }
        (this as IComponent<State, Props, Vm>).reRender();
      }
    };

    vm.getPropsValue = function (valueList: any[], value: any): void {
      let val = value;
      valueList.forEach((v, index: number) => {
        if (index === 0) return;
        val = val[v];
      });
      return val;
    };

    vm.buildProps = function (prop: any): any {
      if (utils.isFunction(prop)) {
        return prop.bind(this as IComponent<State, Props, Vm>);
      } else {
        return prop;
      }
    };

    vm.buildComponentScope = function (ComponentClass: Function, props: any, dom: Element): IComponent<State, Props, Vm> {
      const _component = factoryCreator(ComponentClass, (this as IComponent<State, Props, Vm>).$vm.$rootModule);
      _component.props = props;
      _component.renderDom = dom;
      _component.$components = (this as IComponent<State, Props, Vm>).$components;
      return _component;
    };
  };
}

export default Component;

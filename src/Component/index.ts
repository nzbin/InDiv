import { IComponent, ComponentList } from '../types';

import Compile from '../Compile';
import Watcher from '../Watcher';
import Utils from '../Utils';
import { CompileUtil } from '../CompileUtils';
import { factoryCreator } from '../Injectable';
import { toImmutable } from '../Immutable';


type TComponentOptions = {
  template: string;
  state?: any;
};

function Component<State = any, Props = any, Vm = any>(options: TComponentOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    const vm: IComponent<State, Props, Vm> = _constructor.prototype;
    vm.$template = options.template;
    vm.state = options.state;

    vm.utils = new Utils();
    vm.compileUtil = new CompileUtil();
    vm.$components = {};
    vm.$componentList = [];

    vm.$getLocation = function (): any {
      return {
        path: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.path,
        query: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.query,
        params: (this as IComponent<State, Props, Vm>).$vm.$esRouteObject.params,
      };
    };

    vm.$setLocation = function (path: string, query?: any, params?: any): void {
      const rootPath = (this as IComponent<State, Props, Vm>).$vm.$rootPath === '/' ? '' : (this as IComponent<State, Props, Vm>).$vm.$rootPath;
      history.pushState(
        { path, query, params },
        null,
        `${rootPath}${path}${(this as IComponent<State, Props, Vm>).utils.buildQuery(query)}`,
      );
      (this as IComponent<State, Props, Vm>).$vm.$esRouteObject = { path, query, params };
    };

    vm.$beforeInit = function (): void {
      if (this.props) {
        for (const key in this.props) {
          toImmutable<Props>(this.props[key]);
        }
        // (this as IComponent<State, Props, Vm>).propsWatcher = new Watcher((this as IComponent<State, Props, Vm>).props, (this as IComponent<State, Props, Vm>).esWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).$reRender.bind(this as IComponent<State, Props, Vm>));
      }
      if (this.state) {
        for (const key in this.state) {
          toImmutable<State>(this.state[key]);
        }
        // (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, (this as IComponent<State, Props, Vm>).esWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).$reRender.bind(this as IComponent<State, Props, Vm>));
      }
      // if (this.props) (this as IComponent<State, Props, Vm>).propsWatcher = new Watcher((this as IComponent<State, Props, Vm>).props, (this as IComponent<State, Props, Vm>).esWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).$reRender.bind(this as IComponent<State, Props, Vm>));
      // (this as IComponent<State, Props, Vm>).stateWatcher = new Watcher((this as IComponent<State, Props, Vm>).state, (this as IComponent<State, Props, Vm>).esWatchState.bind(this as IComponent<State, Props, Vm>), (this as IComponent<State, Props, Vm>).$reRender.bind(this as IComponent<State, Props, Vm>));
    };

    vm.$render = function () {
      const dom = (this as IComponent<State, Props, Vm>).$renderDom;
      const compile = new Compile(dom, this as IComponent<State, Props, Vm>);
      (this as IComponent<State, Props, Vm>).$mountComponent(dom, true);
      (this as IComponent<State, Props, Vm>).$componentList.forEach(component => {
        if (component.scope.$render) component.scope.$render();
        if (component.scope.esAfterMount) component.scope.esAfterMount();
      });
      if (this.esHasRender) this.esHasRender();
    };

    vm.esWatchState = (oldData?: any, newData?: any) => { };

    vm.$reRender = function (): void {
      const dom = (this as IComponent<State, Props, Vm>).$renderDom;
      const routerRenderDom = dom.querySelectorAll((this as IComponent<State, Props, Vm>).$vm.$routeDOMKey)[0];
      const compile = new Compile(dom, (this as IComponent<State, Props, Vm>), routerRenderDom);
      (this as IComponent<State, Props, Vm>).$mountComponent(dom, false);
      (this as IComponent<State, Props, Vm>).$componentList.forEach(component => {
        if (component.scope.$render) component.scope.$reRender();
        if (component.scope.esAfterMount) component.scope.esAfterMount();
      });
      if ((this as IComponent<State, Props, Vm>).esHasRender) (this as IComponent<State, Props, Vm>).esHasRender();
    };

    vm.$mountComponent = function (dom: Element, isFirstRender?: boolean): void {
      const saveStates: ComponentList<IComponent<State, Props, Vm>>[] = [];
      (this as IComponent<State, Props, Vm>).$componentList.forEach(component => {
        saveStates.push(component);
      });
      (this as IComponent<State, Props, Vm>).$componentsConstructor(dom);
      (this as IComponent<State, Props, Vm>).$componentList.forEach(component => {
        const saveComponent = saveStates.find(save => save.dom === component.dom);
        if (saveComponent) {
          component.scope = saveComponent.scope;
          component.scope.props = component.props;
        }
        component.scope.$vm = (this as IComponent<State, Props, Vm>).$vm;
        component.scope.$components = (this as IComponent<State, Props, Vm>).$components;
        if (component.scope.$beforeInit) component.scope.$beforeInit();
        if (component.scope.esOnInit && isFirstRender) component.scope.esOnInit();
        if (component.scope.esBeforeMount) component.scope.esBeforeMount();
      });
    };

    vm.$componentsConstructor = function (dom: Element): void {
      (this as IComponent<State, Props, Vm>).$componentList = [];
      const routerRenderDom = dom.querySelectorAll((this as IComponent<State, Props, Vm>).$vm.$routeDOMKey)[0];
      for (const name in ((this as IComponent<State, Props, Vm>).constructor as any)._injectedComponents) {
        (this as IComponent<State, Props, Vm>).$components[name] = ((this as IComponent<State, Props, Vm>).constructor as any)._injectedComponents[name];
      }
      for (const name in (this as IComponent<State, Props, Vm>).$components) {
        const tags = dom.getElementsByTagName(name);
        Array.from(tags).forEach(node => {
          //  protect component in <router-render>
          if (routerRenderDom && routerRenderDom.contains(node)) return;
          const nodeAttrs = node.attributes;
          const props: any = {};
          if (nodeAttrs) {
            const attrList = Array.from(nodeAttrs);
            const _propsKeys: any = {};
            attrList.forEach(attr => {
              if (/^\_prop\-(.+)/.test(attr.name)) _propsKeys[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
            });
            attrList.forEach(attr => {
              const attrName = attr.name;
              const prop = /^\{(.+)\}$/.exec(attr.value);
              if (prop) {
                const valueList = prop[1].split('.');
                const key = valueList[0];
                let _prop = null;
                if (/^(this.).*/g.test(prop[1])) _prop = (this as IComponent<State, Props, Vm>).compileUtil._getVMVal(this as IComponent<State, Props, Vm>, prop[1]);
                if (_propsKeys.hasOwnProperty(key)) _prop = (this as IComponent<State, Props, Vm>).getPropsValue(valueList, _propsKeys[key]);
                props[attrName] = (this as IComponent<State, Props, Vm>).buildProps(_prop);
              }
              node.removeAttribute(attrName);
            });
          }
          (this as IComponent<State, Props, Vm>).$componentList.push({
            dom: node,
            props,
            scope: (this as IComponent<State, Props, Vm>).buildComponentScope((this as IComponent<State, Props, Vm>).$components[name], props, node),
          });
        });
      }
    };

    vm.$setState = function (newState: any): void {
      if (newState && (this as IComponent<State, Props, Vm>).utils.isFunction(newState)) {
        const _newState = newState();
        if (_newState && _newState instanceof Object) {
          for (const key in _newState) {
            // if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== _newState[key]) (this as IComponent<State, Props, Vm>).state[key] = _newState[key];
            if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== _newState[key]) {
              (this as IComponent<State, Props, Vm>).state[key] = _newState[key];
              (this as IComponent<State, Props, Vm>).$reRender();
            }
          }
        }
      }
      if (newState && newState instanceof Object) {
        for (const key in newState) {
          // if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== newState[key]) (this as IComponent<State, Props, Vm>).state[key] = newState[key];
          if ((this as IComponent<State, Props, Vm>).state.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).state[key] !== newState[key]) {
            (this as IComponent<State, Props, Vm>).state[key] = newState[key];
            (this as IComponent<State, Props, Vm>).$reRender();
          }
        }
      }
    };

    vm.$setProps = function (newProps: any): void {
      if (newProps && (this as IComponent<State, Props, Vm>).utils.isFunction(newProps)) {
        const _newProps = newProps();
        if (_newProps && _newProps instanceof Object) {
          for (const key in _newProps) {
            // if ((this as IComponent<State, Props, Vm>).props.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).props[key] !== _newProps[key]) (this as IComponent<State, Props, Vm>).props[key] = _newProps[key];
            if ((this as IComponent<State, Props, Vm>).props.hasOwnProperty(key) && (this as IComponent<State, Props, Vm>).props[key] !== _newProps[key]) {
              (this as IComponent<State, Props, Vm>).props[key] = _newProps[key];
              (this as IComponent<State, Props, Vm>).$reRender();
            }
          }
        }
      }
      if (newProps && newProps instanceof Object) {
        for (const key in newProps) {
          if ((this as IComponent).props.hasOwnProperty(key) && (this as IComponent).props[key] !== newProps[key]) {
            (this as IComponent).props[key] = newProps[key];
            (this as IComponent<State, Props, Vm>).$reRender();
          }
        }
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
      if ((this as IComponent<State, Props, Vm>).utils.isFunction(prop)) {
        return prop.bind(this as IComponent<State, Props, Vm>);
      } else {
        return prop;
      }
    };

    vm.buildComponentScope = function (ComponentClass: Function, props: any, dom: Element): IComponent<State, Props, Vm> {
      const _component = factoryCreator(ComponentClass, (this as IComponent<State, Props, Vm>).$vm.$rootModule);
      _component.props = props;
      _component.$renderDom = dom;
      _component.$components = (this as IComponent<State, Props, Vm>).$components;
      return _component;
    };
  };
}

export default Component;

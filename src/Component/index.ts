import { IService } from '../types';

import Lifecycle from '../Lifecycle';
import Compile from '../Compile';
import Watcher from '../Watcher';
import { Injector } from '../Injectable';

export type ComponentList<C> = {
  dom: Element;
  props: any;
  scope: C;
}

export default abstract class Component<State = any, Props = any, Vm = any> extends Lifecycle<Vm> {
  public static scope?: Component<any, any, any>;
  public static _injectedProviders?: Map<string, Function>;
  public static _injectedComponents?: {
    [name: string]: Function;
  };
  public static _needInjectedClass?: string[];

  public state?: State | any;
  public props?: Props | any;
  public $renderDom?: Element;
  public $globalContext?: any;
  public $vm?: Vm | any;
  public $template?: string;
  public $components?: {
    [name: string]: Function;
  };
  public $componentList?: ComponentList<Component<any, any, any>>[];
  public stateWatcher?: Watcher;
  public propsWatcher?: Watcher;

  constructor() {
    // ...args: ES.IService[]
    super();
    this.state = {};
    this.$renderDom = null;
    this.$globalContext = {};

    this.$vm = null;
    this.$template = null;
    this.$components = {};
    this.$componentList = [];

    if (this.$bootstrap) this.$bootstrap();
  }

  public $bootstrap(): void {};

  public $beforeInit(): void {
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  public $routeChange(lastRoute: string, newRoute: string) {}

  public $render() {
    const dom = this.$renderDom;
    const compile = new Compile(dom, this);
    this.$mountComponent(dom, true);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$render();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
  }

  public $reRender(): void {
    const dom = this.$renderDom;
    const routerRenderDom = dom.querySelectorAll(this.$vm.$routeDOMKey)[0];
    const compile = new Compile(dom, this, routerRenderDom);
    this.$mountComponent(dom, false);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
  }

  public $mountComponent(dom: Element, isFirstRender?: boolean): void {
    const saveStates: ComponentList<Component<any, any, any>>[] = [];
    this.$componentList.forEach(component => {
      saveStates.push(component);
    });
    this.$componentsConstructor(dom);
    this.$componentList.forEach(component => {
      const saveComponent = saveStates.find(save => save.dom === component.dom);
      if (saveComponent) {
        component.scope = saveComponent.scope;
        component.scope.props = component.props;
      }
      component.scope.$vm = this.$vm;
      component.scope.$globalContext = this.$globalContext;
      component.scope.$components = this.$components;
      if (component.scope.$beforeInit) component.scope.$beforeInit();
      if (component.scope.$onInit && isFirstRender) component.scope.$onInit();
      if (component.scope.$beforeMount) component.scope.$beforeMount();
    });
  }

  public $componentsConstructor(dom: Element): void {
    this.$componentList = [];
    const routerRenderDom = dom.querySelectorAll(this.$vm.$routeDOMKey)[0];
    for (const name in (this.constructor as any)._injectedComponents) {
      this.$components[name] = (this.constructor as any)._injectedComponents[name];
    }
    for (const name in this.$components) {
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
              if (/^(this.).*/g.test(prop[1])) _prop = this.compileUtil._getVMVal(this, prop[1]);
              if (_propsKeys.hasOwnProperty(key)) _prop = this.getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = this.buildProps(_prop);
            }
            node.removeAttribute(attrName);
          });
        }
        this.$componentList.push({
          dom: node,
          props,
          scope: this.buildComponentScope(this.$components[name], props, node),
        });
      });
    }
  }

  public $setState(newState: any): void {
    if (newState && this.utils.isFunction(newState)) {
      const _newState = newState();
      if (_newState && _newState instanceof Object) {
        for (const key in _newState) {
          if (this.state.hasOwnProperty(key) && this.state[key] !== _newState[key]) this.state[key] = _newState[key];
        }
      }
    }
    if (newState && newState instanceof Object) {
      for (const key in newState) {
        if (this.state.hasOwnProperty(key) && this.state[key] !== newState[key]) this.state[key] = newState[key];
      }
    }
  }

  public $setProps(newProps: any): void {
    if (newProps && this.utils.isFunction(newProps)) {
      const _newProps = newProps();
      if (_newProps && _newProps instanceof Object) {
        for (const key in _newProps) {
          if (this.props.hasOwnProperty(key) && this.props[key] !== _newProps[key]) this.props[key] = _newProps[key];
        }
      }
    }
    if (newProps && newProps instanceof Object) {
      for (const key in newProps) {
        if (this.props.hasOwnProperty(key) && this.props[key] !== newProps[key]) {
          this.props[key] = newProps[key];
        }
      }
    }
  }

  public $setGlobalContext(newGlobalContext: any): void {
    if (newGlobalContext && this.utils.isFunction(newGlobalContext)) {
      const _newGlobalContext = newGlobalContext();
      if (_newGlobalContext && _newGlobalContext instanceof Object) {
        for (const key in _newGlobalContext) {
          if (this.$globalContext.hasOwnProperty(key) && this.$globalContext[key] !== _newGlobalContext[key]) this.$globalContext[key] = _newGlobalContext[key];
        }
      }
    }
    if (newGlobalContext && newGlobalContext instanceof Object) {
      for (const key in newGlobalContext) {
        if (this.$globalContext.hasOwnProperty(key) && this.$globalContext[key] !== newGlobalContext[key]) {
          this.$globalContext[key] = newGlobalContext[key];
        }
      }
    }
  }

  public getPropsValue(valueList: any[], value: any): void {
    let val = value;
    valueList.forEach((v, index: number) => {
      if (index === 0) return;
      val = val[v];
    });
    return val;
  }

  public buildProps(prop: any): any {
    if (this.utils.isFunction(prop)) {
      return prop.bind(this);
    } else {
      return prop;
    }
  }

  public buildComponentScope(ComponentClass: Function, props: any, dom: Element): Component<any, any, any> {
    // const args = this.createInjector(ComponentClass);
    const args = Injector(ComponentClass, this.$vm.$rootModule);
    const _component: Component<any, any, any> = Reflect.construct(ComponentClass, args);
    _component.props = props;
    _component.$renderDom = dom;
    _component.$components = this.$components;
    return _component;
  }

  // public createInjector(ComponentClass: any): IService[] {
  //   // const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
  //   // const INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{/;
  //   // const INHERITED_CLASS_WITH_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{[\s\S]*constructor\s*\(/;
  //   const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
  //   const argList = ComponentClass.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
  //   const args: IService[] = [];
  //   argList.forEach((arg: string) => {
  //     const argu = `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
  //     console.log('ComponentClass._injectedProviders', ComponentClass._injectedProviders);
  //     const service = ComponentClass._injectedProviders.has(argu) ? ComponentClass._injectedProviders.get(argu) : this.$vm.$rootModule.$providers.find((service: IService) => service.constructor.name === argu);
  //     if (service) args.push(service);
  //   });
  //   return args;
  // }
}

import { IWatcher, ComponentList, IComponent, IService } from './types';

import Lifecycle from '../Lifecycle';
import Compile from '../Compile';
import Watcher from '../Watcher';

abstract class Component<State = any, Props = any, Vm = any> extends Lifecycle<Vm> implements IComponent<State, Props, Vm> {
  static scope: Component<any, any, any>;
  static _injectedComponents: Component<any, any, any>[];
  static _injectedProviders: IService[];

  state: State | any;
  props: Props | any;
  $renderDom: Element;
  $globalContext: any;
  $vm: Vm | any;
  $template: string;
  $components: any;
  $componentList: ComponentList[];
  stateWatcher: IWatcher;
  propsWatcher?: IWatcher;

  constructor() {
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

  $bootstrap(): void {
    this.$template = null;
  }

  $beforeInit(): void {
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $routeChange(lastRoute: string, newRoute: string) {}

  $render() {
    const dom = this.$renderDom;
    // this.compile = new Compile(dom, this);
    const compile = new Compile(dom, this);
    this.$mountComponent(dom, true);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$render();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    // this.compile = null;
  }

  $reRender(): void {
    const dom = this.$renderDom;
    const routerRenderDom = dom.querySelectorAll(this.$vm.$routeDOMKey)[0];
    // this.compile = new Compile(dom, this, routerRenderDom);
    const compile = new Compile(dom, this, routerRenderDom);
    this.$mountComponent(dom, false);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    // this.compile = null;
  }

  $mountComponent(dom: Element, isFirstRender?: boolean): void {
    const saveStates: ComponentList[] = [];
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

  $componentsConstructor(dom: Element): void {
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

  $setState(newState: any): void {
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

  $setProps(newProps: any): void {
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

  $setGlobalContext(newGlobalContext: any): void {
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

  getPropsValue(valueList: any[], value: any): void {
    let val = value;
    valueList.forEach((v, index: number) => {
      if (index === 0) return;
      val = val[v];
    });
    return val;
  }

  buildProps(prop: any): any {
    if (this.utils.isFunction(prop)) {
      return prop.bind(this);
    } else {
      return prop;
    }
  }

  buildComponentScope(ComponentClass: any, props: any, dom: Element): Component<any, any, any> {
    const args = this.createInjector(ComponentClass);
    const _component = Reflect.construct(ComponentClass, args);
    _component.props = props;
    _component.$renderDom = dom;
    _component.$components = this.$components;
    return _component;
  }

  createInjector(ComponentClass: any): any[] {
    // const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
    // const INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{/;
    // const INHERITED_CLASS_WITH_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{[\s\S]*constructor\s*\(/;
    const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
    const argList = ComponentClass.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
    const args: any[] = [];
    argList.forEach((arg: string) => {
      const Service = ComponentClass._injectedProviders.find((service: IService) => service.constructor.name === arg) ? Component._injectedProviders.find(service => service.constructor.name === arg) : this.$vm.$rootModule.$providers.find((service: IService) => service.constructor.name === arg);
      if (Service) args.push(Service);
    });
    return args;
  }
}

export default Component;

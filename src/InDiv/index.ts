import { IMiddleware, INvModule, EsRouteObject, IComponent, ComponentList } from '../types';

import Utils from '../Utils';
import { factoryCreator } from '../DI';
import { factoryModule } from '../NvModule';
import Compile from '../Compile';
import { CompileUtilForRepeat } from '../CompileUtils';

const utils = new Utils();

function render<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  const dom = (this as IComponent<State, Props, Vm>).renderDom;
  return Promise.resolve()
  .then(() => {
    const compile = new Compile(dom, this as IComponent<State, Props, Vm>);
    mountComponent(dom, this);
    const length = (this as IComponent<State, Props, Vm>).$componentList.length;
    for (let i = 0; i < length; i++) {
      const component = (this as IComponent<State, Props, Vm>).$componentList[i];
      if (component.scope.render) component.scope.render();
      if (component.scope.nvAfterMount) component.scope.nvAfterMount();
    }
    if (this.nvHasRender) this.nvHasRender();
    return this;
  })
  .catch(e => {
    // throw new Error(`component ${options.selector} render failed: ${e}`);
  });
}

function reRender<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  const dom = (this as IComponent<State, Props, Vm>).renderDom;
  return Promise.resolve()
  .then(() => {
    const compile = new Compile(dom, (this as IComponent<State, Props, Vm>));
    console.log(333333, this);
    mountComponent(dom, this);
    const length = (this as IComponent<State, Props, Vm>).$componentList.length;
    for (let i = 0; i < length; i++) {
      const component = (this as IComponent<State, Props, Vm>).$componentList[i];
      if (component.scope.render) component.scope.reRender();
      if (component.scope.nvAfterMount) component.scope.nvAfterMount();
    }
    if ((this as IComponent<State, Props, Vm>).nvHasRender) (this as IComponent<State, Props, Vm>).nvHasRender();
    return this;
  })
  .catch(e => {
    // throw new Error(`component ${options.selector} render failed: ${e}`);
  });
}

function mountComponent<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  const cacheStates: ComponentList<IComponent<State, Props, Vm>>[] = [ ...vm.$componentList ];
  componentsConstructor(dom, vm);
  const componentListLength = vm.$componentList.length;
  for (let i = 0; i < componentListLength; i ++) {
    const component = vm.$componentList[i];
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
    } else {
      component.scope = buildComponentScope(component.constructorFunction, component.props, component.dom as Element, vm);
    }

    component.scope.$vm = vm.$vm;
    component.scope.$declarations = vm.$declarations;
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
}

function componentsConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  vm.$componentList = [];
  const routerRenderDom = dom.querySelectorAll(vm.$vm.$routeDOMKey)[0];
  (vm.constructor as any)._injectedDeclarations.forEach((value: Function, key: string) => {
    if (!vm.$declarations.find((declaration: any) => declaration.$selector === key)) vm.$declarations.push(value);
  });
  const declarationsLength = vm.$declarations.length;
  for (let i = 0; i < declarationsLength; i++) {
    // only for Component can continue to render
    if (!((vm.$declarations[i]) as any).$isComponentDirective) continue;

    const name = ((vm.$declarations[i]) as any).$selector;
    const tags = dom.getElementsByTagName(name);
    Array.from(tags).forEach(node => {
      //  protect component in <router-render>
      if (routerRenderDom && routerRenderDom.contains(node)) return;
      // protect Component in Component
      if (!node.isComponent) return;

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
          let attrName: string = attr.name;

          if ((/^\_prop\-(.+)/.test(attrName))) return;

          const attrNameSplit = attrName.split('-');
          if (attrNameSplit.length > 1) {
            attrNameSplit.forEach((name, index) => {
              if (index === 0) attrName = name;
              if (index !== 0) attrName += name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            });
          }

          const prop = /^\{(.+)\}$/.exec(attr.value);
          if (prop) {
            const valueList = prop[1].split('.');
            const key = valueList[0];
            let _prop = null;
            if (/^(\$\.).*/g.test(prop[1])) {
              _prop = vm.compileUtil._getVMVal(vm.state, prop[1]);
              props[attrName] = buildProps(_prop, vm);
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
                if (/(\$\.).*/g.test(arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
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
              _prop = vm.compileUtil._getVMVal(vm, prop[1].replace(/^(\@)/, ''));
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (_propsKeys.hasOwnProperty(key)) {
              _prop = getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (node.repeatData && node.repeatData[key] !== null) {
              _prop = vm.compileUtil._getValueByValue(node.repeatData[key], prop[1], key);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
          }

          // can't remove indiv_repeat_key
          if (attr.name !== 'indiv_repeat_key')  node.removeAttribute(attrName);
        });
      }

      vm.$componentList.push({
        dom: node,
        props,
        scope: null,
        constructorFunction: vm.$declarations[i],
      });
      // after construct instance remove isComponent
      node.isComponent = false;
    });
  }
}

function getPropsValue(valueList: any[], value: any): void {
  let val = value;
  valueList.forEach((v, index: number) => {
    if (index === 0) return;
    val = val[v];
  });
  return val;
}

function buildProps<State = any, Props = any, Vm = any>(prop: any, vm: IComponent<State, Props, Vm>): any {
  if (utils.isFunction(prop)) {
    return prop.bind(vm);
  } else {
    return prop;
  }
}

function buildComponentScope<State = any, Props = any, Vm = any>(ComponentClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const _component = factoryCreator(ComponentClass, vm.$vm.$rootModule);
  _component.props = props;
  _component.renderDom = dom;
  _component.$declarations = vm.$declarations;

  _component.render = render.bind(_component);
  _component.reRender = reRender.bind(_component);

  return _component;
}

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
class InDiv {
  public modalList: IMiddleware<InDiv>[];
  public rootDom: Element;
  public $rootPath: string;
  public $canRenderModule: boolean;
  public $routeDOMKey: string;
  public $rootModule: INvModule;
  public $declarations: Function[];
  public $esRouteObject?: EsRouteObject;
  public $esRouteParmasObject?: {
    [props: string]: any;
  };


  constructor() {
    this.modalList = [];

    if (!utils.isBrowser()) return;

    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
    this.$esRouteObject = null;
    this.$esRouteParmasObject = {};
  }

  /**
   * for using middleware and use bootstrap method of middleware
   *
   * @param {IMiddleware<InDiv>} modal
   * @returns {number}
   * @memberof InDiv
   */
  public use(modal: IMiddleware<InDiv>): number {
    modal.bootstrap(this);
    this.modalList.push(modal);
    return this.modalList.findIndex(md => utils.isEqual(md, modal));
  }

  /**
   * for Route set RootPath
   * 
   * if not use, rootPath will be <router-render />
   *
   * @param {string} rootPath
   * @memberof InDiv
   */
  public setRootPath(rootPath: string): void {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      throw new Error('rootPath is not defined or rootPath must be a String');
    }
  }

  /**
   * bootstrap NvModule
   * 
   * if not use Route it will be used
   *
   * @param {Function} Esmodule
   * @returns {void}
   * @memberof InDiv
   */
  public bootstrapModule(Esmodule: Function): void {
    if (!Esmodule) throw new Error('must send a root module');

    this.$rootModule = factoryModule(Esmodule);
    this.$declarations = [...this.$rootModule.$declarations];
  }

  /**
   * init InDiv and renderModuleBootstrap()
   *
   * @returns {void}
   * @memberof InDiv
   */
  public init(): void {
    if (!utils.isBrowser()) return;

    if (!this.$rootModule) throw new Error('must use bootstrapModule to declare a root NvModule before init');
    if (this.$canRenderModule) this.renderModuleBootstrap();
  }

  /**
   * render NvModule Bootstrap
   *
   * @returns {void}
   * @memberof InDiv
   */
  public renderModuleBootstrap(): void {
    if (!this.$rootModule.$bootstrap) throw new Error('need bootstrap for render Module Bootstrap');
    const BootstrapComponent = this.$rootModule.$bootstrap;
    this.renderComponent(BootstrapComponent, this.rootDom);
  }

  /**
   * expose function for render Component
   *
   * @param {Function} BootstrapComponent
   * @param {Element} renderDOM
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<IComponent> {
    const component: any = factoryCreator(BootstrapComponent, this.$rootModule);

    component.$vm = this;
    component.$declarations = this.$rootModule.$declarations;

    component.render = render.bind(component);
    component.reRender = reRender.bind(component);

    if (component.nvOnInit) component.nvOnInit();
    if (component.watchData) component.watchData();
    if (!component.$template) throw new Error('must decaler this.$template in bootstrap()');
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.nvBeforeMount) component.nvBeforeMount();

      return this.replaceDom(component, renderDOM)
      .then((_component) => {
        if (_component.nvAfterMount) _component.nvAfterMount();
        return _component;
      });

    } else {
      throw new Error('renderBootstrap failed: template or rootDom is not exit');
    }
  }

  /**
   * render adn replace DOM
   *
   * @param {IComponent} component
   * @param {Element} renderDOM
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public replaceDom(component: IComponent, renderDOM: Element): Promise<IComponent> {
    component.renderDom = renderDOM;
    return component.render();
  }
}

export default InDiv;

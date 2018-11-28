import { IComponent, IDirective, factoryCreator, Utils, InDiv, ElementRef } from '@indiv/core';

const utils = new Utils();

/**
 * get props from value
 *
 * @export
 * @param {any[]} valueList
 * @param {*} value
 * @returns {void}
 */
export function getPropsValue(valueList: any[], value: any): void {
  let val = value;
  valueList.forEach((v, index: number) => {
    if (index === 0) return;
    val = val[v];
  });
  return val;
}

/**
 * build Actions for Props in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {*} prop
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {*}
 */
export function buildProps<State = any, Props = any, Vm = any>(prop: any, vm: IComponent<State, Props, Vm>): any {
  if (utils.isFunction(prop)) {
    return prop.bind(vm);
  } else {
    return prop;
  }
}

/**
 * build scope for Components in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Function} ComponentClass
 * @param {*} props
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {IComponent<State, Props, Vm>}
 */
export function buildComponentScope<State = any, Props = any, Vm = any>(ComponentClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const provideAndInstanceMap = new Map();
  if (provideAndInstanceMap) provideAndInstanceMap.set(InDiv, vm.$vm);
  provideAndInstanceMap.set(ElementRef, dom);

  const _component: IComponent = factoryCreator(ComponentClass, vm.otherInjector, provideAndInstanceMap);
  _component.props = props;
  _component.renderDom = dom;

  vm.$declarationMap.forEach((declaration, key) => {
    if (!_component.$declarationMap.has(key)) _component.$declarationMap.set(key, declaration);
  });

  _component.render = vm.$vm.render.bind(_component);
  _component.reRender = vm.$vm.reRender.bind(_component);
  _component.otherInjector = vm.otherInjector;

  return _component;
}

/**
 * build scope for Directives in Directive
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Function} DirectiveClass
 * @param {*} props
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {IComponent<State, Props, Vm>}
 */
export function buildDirectiveScope<State = any, Props = any, Vm = any>(DirectiveClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const provideAndInstanceMap = new Map();
  if (vm.$vm) provideAndInstanceMap.set(InDiv, vm.$vm);
  provideAndInstanceMap.set(ElementRef, dom);

  const _directive: IDirective = factoryCreator(DirectiveClass, vm.otherInjector, provideAndInstanceMap);

  _directive.props = props;
  _directive.renderDom = dom;

  vm.$declarationMap.forEach((declaration, key) => {
    if (!_directive.$declarationMap.has(key)) _directive.$declarationMap.set(key, declaration);
  });

  _directive.otherInjector = vm.otherInjector;

  return _directive;
}

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
    return JSON.parse(JSON.stringify(prop));
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
 * @param {IComponent<State, Props, Vm>} componentInstance
 * @returns {IComponent<State, Props, Vm>}
 */
export function buildComponentScope<State = any, Props = any, Vm = any>(ComponentClass: Function, props: any, dom: Element, componentInstance: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const provideAndInstanceMap = new Map();
  if (provideAndInstanceMap) provideAndInstanceMap.set(InDiv, componentInstance.$indivInstance);
  provideAndInstanceMap.set(ElementRef, new ElementRef(dom));

  const _component: IComponent = factoryCreator(ComponentClass, componentInstance.otherInjector, provideAndInstanceMap);
  _component.props = props;
  _component.renderNode = dom;

  componentInstance.declarationMap.forEach((declaration, key) => {
    if (!_component.declarationMap.has(key)) _component.declarationMap.set(key, declaration);
  });

  // bind compile for @Component
  _component.compiler = componentInstance.$indivInstance.getComponentCompiler().bind(_component);
  _component.otherInjector = componentInstance.otherInjector;

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
 * @param {IComponent<State, Props, Vm>} componentInstance
 * @returns {IComponent<State, Props, Vm>}
 */
export function buildDirectiveScope<State = any, Props = any, Vm = any>(DirectiveClass: Function, props: any, dom: Element, componentInstance: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const provideAndInstanceMap = new Map();
  if (componentInstance.$indivInstance) provideAndInstanceMap.set(InDiv, componentInstance.$indivInstance);
  provideAndInstanceMap.set(ElementRef, new ElementRef(dom));

  const _directive: IDirective = factoryCreator(DirectiveClass, componentInstance.otherInjector, provideAndInstanceMap);

  _directive.props = props;
  _directive.renderNode = dom;

  componentInstance.declarationMap.forEach((declaration, key) => {
    if (!_directive.declarationMap.has(key)) _directive.declarationMap.set(key, declaration);
  });

  _directive.otherInjector = componentInstance.otherInjector;

  return _directive;
}

import { IComponent } from '../../types';

import { factoryCreator } from '../../di';
import { Utils } from '../../utils';

const utils = new Utils();
/**
 * get props from value
 *
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
  const _component = factoryCreator(ComponentClass, vm.$vm.$rootModule);
  _component.props = props;
  _component.renderDom = dom;
  _component.$declarations = vm.$declarations;

  _component.render = vm.$vm.render.bind(_component);
  _component.reRender = vm.$vm.reRender.bind(_component);

  return _component;
}

/**
 * build scope for Directives in Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Function} ComponentClass
 * @param {*} props
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {IComponent<State, Props, Vm>}
 */
export function buildDirectiveScope<State = any, Props = any, Vm = any>(DirectiveClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm> {
  const _directive = factoryCreator(DirectiveClass, vm.$vm.$rootModule);
  _directive.props = props;
  _directive.renderDom = dom;
  _directive.$declarations = vm.$declarations;

  return _directive;
}

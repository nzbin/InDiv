import { IComponent } from '@indiv/core';
/**
 * get props from value
 *
 * @export
 * @param {any[]} valueList
 * @param {*} value
 * @returns {void}
 */
export declare function getPropsValue(valueList: any[], value: any): void;
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
export declare function buildProps<State = any, Props = any, Vm = any>(prop: any, vm: IComponent<State, Props, Vm>): any;
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
export declare function buildComponentScope<State = any, Props = any, Vm = any>(ComponentClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm>;
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
export declare function buildDirectiveScope<State = any, Props = any, Vm = any>(DirectiveClass: Function, props: any, dom: Element, vm: IComponent<State, Props, Vm>): IComponent<State, Props, Vm>;

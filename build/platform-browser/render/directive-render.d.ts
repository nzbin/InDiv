import { IDirective, IRenderTaskQueue } from '../../types';
/**
 * mountDirective for Directives in Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IDirective<State, Props, Vm>} vm
 */
export declare function mountDirective<State = any, Props = any, Vm = any>(dom: Element, vm: IDirective<State, Props, Vm>): void;
/**
 * construct Directives in Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IDirective<State, Props, Vm>} vm
 */
export declare function directivesConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IDirective<State, Props, Vm>): void;
/**
 * render Component with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {IRenderTaskQueue} RenderTaskQueue
 * @returns {Promise<IDirective>}
 */
export declare function directiveRenderFunction(renderDom: Element, RenderTaskQueue: IRenderTaskQueue): Promise<IDirective>;

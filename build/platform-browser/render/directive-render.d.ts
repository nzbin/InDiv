import { IDirective, IComponent } from '../../types';
import { RenderTaskQueue } from './render-task-queue';
/**
 * mountDirective for Directives in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export declare function mountDirective<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void;
/**
 * construct Directives in Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export declare function directivesConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void;
/**
 * render Directive with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {RenderTaskQueue} RenderTaskQueue
 * @returns {Promise<IDirective>}
 */
export declare function directiveRenderFunction(renderDom: Element, RenderTaskQueue: RenderTaskQueue): Promise<IDirective>;

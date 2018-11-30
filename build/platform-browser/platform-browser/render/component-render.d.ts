import { IComponent } from '@indiv/core';
import { RenderTaskQueue } from './render-task-queue';
/**
 * mountComponent for Components in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export declare function mountComponent<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void;
/**
 * construct Components in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export declare function componentsConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void;
/**
 * render Component with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {RenderTaskQueue} RenderTaskQueue
 * @returns {Promise<IComponent>}
 */
export declare function componentRenderFunction(renderDom: Element, RenderTaskQueue: RenderTaskQueue): Promise<IComponent>;

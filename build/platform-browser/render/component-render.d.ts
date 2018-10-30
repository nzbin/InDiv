import { IComponent, IRenderTask } from '../../types';
/**
 * mountComponent for Components in Component
 *
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
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export declare function componentsConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void;
/**
 * render Function for render Component with renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {IRenderTask} vm
 * @returns {Promise<IComponent>}
 */
export declare function renderFunction(renderDom: Element, vm: IRenderTask): Promise<IComponent>;

import { IComponent } from '../../types';
/**
 * render function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
export declare function render<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>>;

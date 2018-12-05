import { IComponent } from '../types';

import { RenderTaskQueue } from './render-task-queue';

export { RenderTaskQueue } from './render-task-queue';

/**
 * render function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
export function render<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  const dom = (this as IComponent<State, Props, Vm>).renderNode;

  if (!(this as IComponent<State, Props, Vm>).renderTaskQueue) (this as IComponent<State, Props, Vm>).renderTaskQueue = new RenderTaskQueue(this);
  return (this as IComponent<State, Props, Vm>).renderTaskQueue.push(dom);
}

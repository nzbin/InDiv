import { IComponent } from '../../types';

import { CompileUtil } from '../compile';
import { RenderTaskQueue } from './render-task-queue';

/**
 * render function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
export function render<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  (this as IComponent<State, Props, Vm>).compileUtil = new CompileUtil();
  const dom = (this as IComponent<State, Props, Vm>).renderDom;

  if (!this.renderTaskQueue) this.renderTaskQueue = new RenderTaskQueue(this);
  return this.renderTaskQueue.push(dom);
}

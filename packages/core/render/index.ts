import { IComponent } from '../types';

import { RenderTaskQueue } from './render-task-queue';

export { RenderTaskQueue } from './render-task-queue';

/**
 * render function for Component
 *
 * @returns {Promise<IComponent}
 */
export function render(): Promise<IComponent> {
  const dom = (this as IComponent).renderNode;

  if (!(this as IComponent).renderTaskQueue) (this as IComponent).renderTaskQueue = new RenderTaskQueue(this);
  return (this as IComponent).renderTaskQueue.push(dom);
}

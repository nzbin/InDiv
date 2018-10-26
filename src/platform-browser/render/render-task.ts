import { IComponent, IRenderTask } from '../../types';

import { renderFunction } from './component-render';

const PENDING = 'pending';
const RENDERING = 'rendering';

export type TRenderStatus = 'pending' | 'rendering';

export class RenderTask {
  public $vm: IComponent;
  public taskQueue: Element[];
  private renderStatus: TRenderStatus;

  constructor(vm: IComponent) {
    this.$vm = vm;
    this.taskQueue = [];
    this.renderStatus = PENDING;
  }

  public push(renderDom: Element): Promise<IComponent> {
    this.taskQueue.push(renderDom);
    if (this.renderStatus === PENDING) {
      this.renderStatus = RENDERING;
      return this.render();
    }
  }

  public async render(): Promise<IComponent> {
    const component = await renderFunction(this.taskQueue[0], this as IRenderTask);
    this.nextTick();
    return component;
  }

  public async nextTick(): Promise<IComponent> {
    this.taskQueue.shift();
    if (this.taskQueue.length === 0) {
      this.renderStatus = PENDING;
    } else {
      return this.render();
    }
  }
}

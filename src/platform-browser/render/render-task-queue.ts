import { IComponent, IRenderTaskQueue } from '../../types';

import { renderFunction } from './component-render';

const PENDING = 'pending';
const RENDERING = 'rendering';

export type TRenderStatus = 'pending' | 'rendering';

export class RenderTaskQueue {
  public $vm: IComponent;
  private taskQueue: Element[]; // 渲染队列
  private renderStatus: TRenderStatus; // 渲染状态：'pending' | 'rendering'
  private stackPointer: number; // 队列指针

  constructor(vm: IComponent) {
    this.$vm = vm;
    this.resetStatus();
  }

  /**
   * push task in taskQueue
   * 
   * if renderStatus === rendering, so only push task
   * if renderStatus === pending, so push task and start runTask
   *
   * @param {Element} renderDom
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  public push(renderDom: Element): Promise<IComponent> {
    this.taskQueue.push(renderDom);
    if (this.renderStatus === PENDING) {
      this.renderStatus = RENDERING;
      return this.runTask();
    }
  }

  /**
   * stop render task and save stackPointer
   *
   * @memberof RenderTaskQueue
   */
  public stopTask(): void {
    this.renderStatus = PENDING;
  }

  /**
   * run task and then run next task
   *
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  public async runTask(): Promise<IComponent> {
    const component = await renderFunction(this.taskQueue[this.stackPointer], this as IRenderTaskQueue);
    this.nextTask();
    return component;
  }

  /**
   * run next task
   * 
   * if stackPointer is taskQueue.length -1, then stop render and reset stackPointer, renderStatus, taskQueue
   * 
   * @private
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  private async nextTask(): Promise<IComponent> {
    // 如果指针已经到达队列结尾，更改状态为等待，指针恢复为0，并清空队列
    if (this.taskQueue.length === this.stackPointer + 1) this.resetStatus();
    // 更新指针，如果暂停就停止渲染。
    // 这样下次渲染就会到上次被暂停的那个地方。
    else {
      this.stackPointer ++;
      if (this.renderStatus === PENDING) return;
      return this.runTask();
    }
  }

  /**
   * reset renderStatus, stackPointer, taskQueue
   *
   * @private
   * @memberof RenderTaskQueue
   */
  private resetStatus(): void {
    this.renderStatus = PENDING;
    this.stackPointer = 0;
    if (this.taskQueue) this.taskQueue.length = 0;
    else this.taskQueue = [];
  }
}

import { IComponent } from '../types';

const PENDING = 'pending';
const RENDERING = 'rendering';

export type TRenderStatus = 'pending' | 'rendering';

export class RenderTaskQueue {
  public componentInstance: IComponent;
  private taskQueue: Element[]; // 渲染队列
  private renderStatus: TRenderStatus; // 渲染状态：'pending' | 'rendering'
  private queuePointer: number; // 队列指针

  constructor(componentInstance: IComponent) {
    this.componentInstance = componentInstance;
    this.resetStatus();
  }

  /**
   * push task in taskQueue
   * 
   * if renderStatus === rendering, so only push task
   * if renderStatus === pending, so push task and start runTask
   * @param {(Element | any)} nativeElement
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  public push(nativeElement: Element | any): Promise<IComponent> {
    this.taskQueue.push(nativeElement);
    if (this.renderStatus === PENDING) {
      this.renderStatus = RENDERING;
      return this.runTask();
    }
  }

  /**
   * stop render task and save queuePointer
   *
   * @memberof RenderTaskQueue
   */
  public stopTask(): void {
    this.renderStatus = PENDING;
  }

  /**
   * run task and then run next task
   * 
   * in this method will use compile method of @Component
   *
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  public async runTask(): Promise<IComponent> {
    // todo add compile children
    const component = await this.componentInstance.compiler(this.taskQueue[this.queuePointer], this.componentInstance);
    this.nextTask();
    return component;
  }

  /**
   * run next task
   * 
   * if queuePointer is taskQueue.length -1, then stop render and reset queuePointer, renderStatus, taskQueue
   * 
   * @private
   * @returns {Promise<IComponent>}
   * @memberof RenderTaskQueue
   */
  private async nextTask(): Promise<IComponent> {
    // 如果指针已经到达队列结尾，更改状态为等待，指针恢复为0，并清空队列
    if (this.taskQueue.length === this.queuePointer + 1) this.resetStatus();
    // 更新指针，如果暂停就停止渲染。
    // 这样下次渲染就会到上次被暂停的那个地方。
    else {
      this.queuePointer ++;
      if (this.renderStatus === PENDING) return;
      return this.runTask();
    }
  }

  /**
   * reset renderStatus, queuePointer, taskQueue
   *
   * @private
   * @memberof RenderTaskQueue
   */
  private resetStatus(): void {
    this.renderStatus = PENDING;
    this.queuePointer = 0;
    if (this.taskQueue) this.taskQueue.length = 0;
    else this.taskQueue = [];
  }
}

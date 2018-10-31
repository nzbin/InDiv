import { IComponent } from '../../types';
export declare type TRenderStatus = 'pending' | 'rendering';
export declare class RenderTaskQueue {
    $vm: IComponent;
    private taskQueue;
    private renderStatus;
    private stackPointer;
    constructor(vm: IComponent);
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
    push(renderDom: Element): Promise<IComponent>;
    /**
     * stop render task and save stackPointer
     *
     * @memberof RenderTaskQueue
     */
    stopTask(): void;
    /**
     * run task and then run next task
     *
     * @returns {Promise<IComponent>}
     * @memberof RenderTaskQueue
     */
    runTask(): Promise<IComponent>;
    /**
     * run next task
     *
     * if stackPointer is taskQueue.length -1, then stop render and reset stackPointer, renderStatus, taskQueue
     *
     * @private
     * @returns {Promise<IComponent>}
     * @memberof RenderTaskQueue
     */
    private nextTask;
    /**
     * reset renderStatus, stackPointer, taskQueue
     *
     * @private
     * @memberof RenderTaskQueue
     */
    private resetStatus;
}

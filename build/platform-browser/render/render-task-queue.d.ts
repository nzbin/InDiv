import { IComponent } from '@indiv/core';
export declare type TRenderStatus = 'pending' | 'rendering';
export declare class RenderTaskQueue {
    $vm: IComponent;
    private taskQueue;
    private renderStatus;
    private queuePointer;
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
     * stop render task and save queuePointer
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
     * if queuePointer is taskQueue.length -1, then stop render and reset queuePointer, renderStatus, taskQueue
     *
     * @private
     * @returns {Promise<IComponent>}
     * @memberof RenderTaskQueue
     */
    private nextTask;
    /**
     * reset renderStatus, queuePointer, taskQueue
     *
     * @private
     * @memberof RenderTaskQueue
     */
    private resetStatus;
}

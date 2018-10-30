import { IComponent } from '../../types';
export declare type TRenderStatus = 'pending' | 'rendering';
export declare class RenderTask {
    $vm: IComponent;
    taskQueue: Element[];
    private renderStatus;
    constructor(vm: IComponent);
    push(renderDom: Element): Promise<IComponent>;
    render(): Promise<IComponent>;
    runNextTask(): Promise<IComponent>;
}

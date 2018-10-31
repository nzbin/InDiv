import { IComponent } from '../component';
export interface IRenderTaskQueue {
    $vm: IComponent;
    push(renderDom: Element): Promise<IComponent>;
    runTask(): Promise<IComponent>;
    stopTask(): void;
}

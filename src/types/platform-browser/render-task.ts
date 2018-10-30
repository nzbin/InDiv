import { IComponent } from '../component';

export interface IRenderTask {
  $vm: IComponent;
  taskQueue: Element[];

  push(renderDom: Element): Promise<IComponent>;
  render(): Promise<IComponent>;
  runNextTask(): Promise<IComponent>;
}

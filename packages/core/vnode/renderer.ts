import { Vnode, TAttributes } from './parse-tag';
import { ParseOptions } from './parse';

/**
 * Renderer in Indiv
 * 
 * can rewrite your Render for different platform
 *
 * @export
 * @abstract
 * @class Renderer
 */
export abstract class Renderer {
  public abstract nativeElementToVnode(nativeElement: any, parseVnodeOptions?: ParseOptions): Vnode[];
  public abstract removeChild(parentVnode: Vnode, childVnode: Vnode): void;
  public abstract appendChild(parentVnode: Vnode, childVnode: Vnode): void;
  public abstract insertBefore(parentVnode: Vnode, childVnode: Vnode, index: number): void;
  public abstract isContainted(parentVnode: Vnode, childVnode: Vnode): boolean;
  public abstract creatElement(createdVnode: Vnode): any;
  public abstract creatTextElement(createdVnode: Vnode): any;
  public abstract setAttribute(vnode: Vnode, attribute: TAttributes): void;
  public abstract setNvAttribute(vnode: Vnode, attribute: TAttributes): void;
  public abstract removeAttribute(vnode: Vnode, attribute: TAttributes): void;
  public abstract removeNvAttribute(vnode: Vnode, attribute: TAttributes): void;
  public abstract setNodeValue(vnode: Vnode, nodeValue: any): void;
  public abstract setValue(vnode: Vnode, value: any): void;
  public abstract removeEventListener(vnode: Vnode, eventType: string, handler: any): void;
  public abstract addEventListener(vnode: Vnode, eventType: string, handler: any): void;
}

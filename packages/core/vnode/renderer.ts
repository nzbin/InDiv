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
  public abstract getElementsByTagName(name: string): any;
  public abstract hasChildNodes(nativeElement: any): boolean;
  public abstract getChildNodes(nativeElement: any): any[];
  public abstract removeChild(parent: any, child: any): void;
  public abstract appendChild(parent: any, child: any): void;
  public abstract insertBefore(parent: any, child: any, index: number): void;
  public abstract isContainted(parent: any, child: any): boolean;
  public abstract creatElement(name: string): any;
  public abstract creatTextElement(value: string): any;
  public abstract getAttribute(element: any, name: string): any;
  public abstract setAttribute(element: any, attribute: TAttributes): void;
  public abstract setNvAttribute(element: any, attribute: TAttributes): void;
  public abstract removeAttribute(element: any, attribute: TAttributes): void;
  public abstract removeNvAttribute(element: any, attribute: TAttributes): void;
  public abstract setNodeValue(element: any, nodeValue: any): void;
  public abstract setValue(element: any, value: any): void;
  public abstract removeEventListener(element: any, eventType: string, handler: any): void;
  public abstract addEventListener(element: any, eventType: string, handler: any): void;
}

import { Renderer, Vnode, ParseOptions } from '@indiv/core';
/**
 * get template from nativeElement
 *
 * @export
 * @param {Element} nativeElement
 * @returns {string}
 */
export declare function getTemplate(nativeElement: Element): string;
/**
 * parse nativeElement to vnode
 *
 * @export
 * @param {Element} nativeElement
 * @param {Vnode[]} vnodeList
 * @param {Vnode} parentVnode
 * @param {ParseOptions} [parseVnodeOptions]
 */
export declare function parseNativeElementToVnode(nativeElement: Element, vnodeList: Vnode[], parentVnode: Vnode, parseVnodeOptions?: ParseOptions): void;
/**
 * InDiv Render for paltform browser
 *
 * @export
 * @class PlatfromBrowserRenderer
 * @extends {Renderer}
 */
export declare class PlatfromBrowserRenderer extends Renderer {
    nativeElementToVnode(nativeElement: Element, parseVnodeOptions?: ParseOptions): Vnode[];
    getElementsByTagName(name: string): HTMLCollectionOf<Element>;
    hasChildNodes(nativeElement: Element): boolean;
    getChildNodes(nativeElement: Element): Element[];
    removeChild(parent: Element, child: Element): void;
    appendChild(parent: Element, child: Element): void;
    insertBefore(parent: Element, child: Element, index: number): void;
    isContainted(parent: Element, child: Element): boolean;
    creatElement(tagName: string): any;
    creatTextElement(value: string): any;
    getAttribute(element: Element, name: string): string;
    setNvAttribute(element: Element, name: string, value: any): void;
    setAttribute(element: Element, name: string, value: any): void;
    removeNvAttribute(element: Element, name: string, value?: any): void;
    removeAttribute(element: Element, name: string, value?: any): void;
    setNodeValue(element: Element, nodeValue: any): void;
    setValue(element: HTMLInputElement, value: any): void;
    removeEventListener(element: Element, eventType: string, handler: any): void;
    addEventListener(element: Element, eventType: string, handler: any): void;
    setStyle(element: HTMLElement, name: string, value: any): void;
    removeStyle(element: HTMLElement, name: string): void;
    getStyle(element: HTMLElement, name: string): any;
}

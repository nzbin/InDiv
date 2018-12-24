import { Renderer, Vnode, TAttributes, parseTemplateToVnode, ParseOptions } from '@indiv/core';

/**
 * get template from nativeElement
 *
 * @export
 * @param {Element} nativeElement
 * @returns {string}
 */
export function getTemplate(nativeElement: Element): string {
  const copyElement = nativeElement.cloneNode();
  const tagName = nativeElement.tagName.toLocaleLowerCase();
  let tmpNode = document.createElement('div');
  tmpNode.appendChild(copyElement);
  const template = tmpNode.innerHTML;
  tmpNode = nativeElement = null;
  if (new RegExp(`^\<${tagName}.*\>\<\/${tagName}\>$`).test(template)) return template.split(`</${tagName}>`)[0];
  return template;
}

/**
 * parse nativeElement to vnode
 *
 * @export
 * @param {Element} nativeElement
 * @param {Vnode[]} vnodeList
 * @param {Vnode} parentVnode
 * @param {ParseOptions} [parseVnodeOptions]
 */
export function parseNativeElementToVnode(nativeElement: Element, vnodeList: Vnode[], parentVnode: Vnode, parseVnodeOptions?: ParseOptions): void {
  let type = 'text';
  if (nativeElement.nodeType === 1) type = 'tag';
  if (nativeElement.nodeType === 1 && nativeElement.tagName && parseVnodeOptions.components.indexOf(nativeElement.tagName.toLocaleLowerCase()) !== -1) type = 'component';

  let voidElement = false;
  if (type === 'text' || !nativeElement.hasChildNodes()) voidElement = true;

  const newVnode = new Vnode({
    tagName: type !== 'text' ? nativeElement.tagName.toLocaleLowerCase() : null,
    nativeElement,
    parentVnode,
    attributes: [],
    nodeValue: type === 'text' ? nativeElement.nodeValue : null,
    childNodes: type !== 'text' ? [] : null,
    type,
    value: type !== 'text' && (nativeElement.tagName.toLocaleLowerCase() === 'input' || nativeElement.tagName.toLocaleLowerCase() === 'textarea') ? (nativeElement as HTMLInputElement).value : null,
    repeatData: null,
    eventTypes: [],
    key: null,
    checked: false,
    voidElement, 
    template: type === 'text' ? nativeElement.nodeValue : getTemplate(nativeElement),
  });

  vnodeList.push(newVnode);
  if (type !== 'component' && nativeElement.hasChildNodes()) Array.from(nativeElement.childNodes).forEach(child => parseNativeElementToVnode(child as Element, newVnode.childNodes, newVnode, parseVnodeOptions));
}

/**
 * InDiv Render for paltform browser
 *
 * @export
 * @class PlatfromBrowserRenderer
 * @extends {Renderer}
 */
export class PlatfromBrowserRenderer extends Renderer {
  public nativeElementToVnode(nativeElement: Element, parseVnodeOptions?: ParseOptions): Vnode[] {
    if (!nativeElement.hasChildNodes()) return parseTemplateToVnode(nativeElement.innerHTML, parseVnodeOptions);
    const vnodeList: Vnode[] = [];
    Array.from(nativeElement.childNodes).forEach(child => parseNativeElementToVnode(child as Element, vnodeList, null, parseVnodeOptions));
    return vnodeList;
  }

  public getElementsByTagName(name: string): HTMLCollectionOf<Element> {
    return document.getElementsByTagName(name);
  }

  public hasChildNodes(nativeElement: Element): boolean {
    return nativeElement.hasChildNodes();
  }

  public getChildNodes(nativeElement: Element): Element[] {
    const childNodes: Element[] = [];
    if (nativeElement.hasChildNodes()) Array.from(nativeElement.childNodes).forEach(child => childNodes.push(child as Element));
    return childNodes;
  }

  public removeChild(parent: Element, child: Element): void {
    (parent as Element).removeChild(child as Element);
  }

  public appendChild(parent: Element, child: Element): void {
    (parent as Element).appendChild(child as Element);
  }

  public insertBefore(parent: Element, child: Element, index: number): void {
    parent.insertBefore(child, parent.childNodes[index]);
  }

  public isContainted(parent: Element, child: Element): boolean {
    return parent.contains(child);
  }

  public creatElement(name: string): any {
    return document.createElement(name.toLocaleUpperCase());
  }

  public creatTextElement(value: string): any {
    return document.createTextNode(value);
  }

  public getAttribute(element: Element, name: string): string {
    return element.getAttribute(name);
  }

  public setNvAttribute(element: Element, attribute: TAttributes): void {
    const blackListAttr = ['nv-text', 'nv-if', 'nv-repeat', 'nv-model', 'nv-key'];
    if (blackListAttr.indexOf(attribute.name) !== -1) return;
    switch (attribute.name) {
      case 'nv-html': {
        element.innerHTML = typeof attribute.nvValue === 'undefined' ? '' : attribute.nvValue;
        break;
      }
      case 'nv-class': {
        let className = element.className;
        className = className.replace(/\s$/, '');
        const space = className && String(attribute.nvValue) ? ' ' : '';
        element.className = className + space + attribute.nvValue;
        break;
      }
      default: {
        const attrName = attribute.name.replace('nv-', '');
        element.setAttribute(attrName, attribute.nvValue);
      }
    }
  }

  public setAttribute(element: Element, attribute: TAttributes): void {
    element.setAttribute(attribute.name, attribute.value);
  }

  public removeNvAttribute(element: Element, attribute: TAttributes): void {
    const blackListAttr = ['nv-text', 'nv-if', 'nv-repeat', 'nv-model', 'nv-key'];
    if (blackListAttr.indexOf(attribute.name) !== -1) return;
    switch (attribute.name) {
      case 'nv-html': {
        element.innerHTML = '';
        break;
      }
      case 'nv-class': {
        let className = element.className;
        className = className.replace(/\s$/, '');
        const space = className && String(attribute.value) ? ' ' : '';
        element.className = className + space + attribute.value;
        break;
      }
      default: {
        const attrName = attribute.name.replace('nv-', '');
        element.removeAttribute(attrName);
      }
    }
  }

  public removeAttribute(element: Element, attribute: TAttributes): void {
    element.removeAttribute(attribute.name);
  }

  public setNodeValue(element: Element, nodeValue: any): void {
    element.nodeValue = nodeValue;
  }

  public setValue(element: HTMLInputElement, value: any): void {
    element.value = value;
  }

  public removeEventListener(element: Element, eventType: string, handler: any): void {
    element.removeEventListener(eventType, handler);
  }

  public addEventListener(element: Element, eventType: string, handler: any): void {
    element.addEventListener(eventType, handler);
  }
}

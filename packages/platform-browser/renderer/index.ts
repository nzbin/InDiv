import { Renderer, Vnode, TAttributes, parseTemplateToVnode, ParseOptions } from '@indiv/core';

/**
 * InDiv Render for paltform browser
 *
 * @export
 * @class PlatfromBrowserRenderer
 * @extends {Renderer}
 */
export class PlatfromBrowserRenderer extends Renderer {
  public nativeElementToVnode(nativeElement: any, parseVnodeOptions?: ParseOptions): Vnode[] {
    return parseTemplateToVnode(nativeElement.innerHTML, parseVnodeOptions);
  }

  public removeChild(parent: any, child: any): void {
    (parent as Element).removeChild(child as Element);
  }

  public appendChild(parent: any, child: any): void {
    (parent as Element).appendChild(child as Element);
  }

  public insertBefore(parent: any, child: any, index: number): void {
    (parent as Element).insertBefore(child as Element, (parent as Element).childNodes[index]);
  }

  public isContainted(parent: any, child: any): boolean {
    return (parent as Element).contains(child as Element);
  }

  public creatElement(name: string): any {
    return document.createElement(name.toLocaleUpperCase());
  }

  public creatTextElement(value: string): any {
    return document.createTextNode(value);
  }

  public setNvAttribute(element: any, attribute: TAttributes): void {
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
        (element as Element).setAttribute(attrName, attribute.nvValue);
      }
    }
  }

  public setAttribute(element: any, attribute: TAttributes): void {
    (element as Element).setAttribute(attribute.name, attribute.value);
  }

  public removeNvAttribute(element: any, attribute: TAttributes): void {
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
        (element as Element).removeAttribute(attrName);
      }
    }
  }

  public removeAttribute(element: any, attribute: TAttributes): void {
    (element as Element).removeAttribute(attribute.name);
  }

  public setNodeValue(element: any, nodeValue: any): void {
    (element as Element).nodeValue = nodeValue;
  }

  public setValue(element: any, value: any): void {
    (element as HTMLInputElement).value = value;
  }

  public removeEventListener(element: any, eventType: string, handler: any): void {
    (element as Element).removeEventListener(eventType, handler);
  }

  public addEventListener(element: any, eventType: string, handler: any): void {
    (element as Element).addEventListener(eventType, handler);
  }
}

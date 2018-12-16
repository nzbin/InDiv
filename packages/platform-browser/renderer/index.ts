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
  public removeChild(parentVnode: Vnode, childVnode: Vnode): void {
    parentVnode.nativeElement.removeChild(childVnode.nativeElement);
  }

  public appendChild(parentVnode: Vnode, childVnode: Vnode): void {
    parentVnode.nativeElement.appendChild(childVnode.nativeElement);
  }

  public insertBefore(parentVnode: Vnode, childVnode: Vnode, index: number): void {
    parentVnode.nativeElement.insertBefore(childVnode.nativeElement, parentVnode.childNodes[index].nativeElement);
  }

  public isContainted(parentVnode: Vnode, childVnode: Vnode): boolean {
    return parentVnode.nativeElement.contains(childVnode.nativeElement);
  }

  public creatElement(createdVnode: Vnode): any {
    return document.createElement(createdVnode.tagName.toLocaleUpperCase());
  }

  public creatTextElement(createdVnode: Vnode): any {
    return document.createTextNode(createdVnode.nodeValue);
  }

  public setNvAttribute(vnode: Vnode, attribute: TAttributes): void {
    const blackListAttr = [ 'nv-text', 'nv-if', 'nv-repeat' ];
    if (blackListAttr.indexOf(attribute.type) !== -1)  return;
    switch (attribute.name) {
      case 'nv-html':
        vnode.nativeElement.innerHTML = typeof attribute.nvValue === 'undefined' ? '' : attribute.nvValue;
        break;
      case 'nv-model':
        vnode.value = attribute.nvValue;
        break;
      case 'nv-key':
        vnode.key = attribute.nvValue;
        break;
      case 'nv-class':
        let className = vnode.nativeElement.className;
        className = className.replace(/\s$/, '');
        const space = className && String(attribute.nvValue) ? ' ' : '';
        vnode.nativeElement.className = className + space + attribute.nvValue;
        break;
      default:
        const attrName = attribute.name.replace('nv-', '');
        vnode.nativeElement[attrName] = attribute.nvValue;
    }
  }
  
  public setAttribute(vnode: Vnode, attribute: TAttributes): void {
    (vnode.nativeElement as Element).setAttribute(attribute.name, attribute.value);
  }

  public removeNvAttribute(vnode: Vnode, attribute: TAttributes): void {
    const blackListAttr = [ 'nv-text', 'nv-if', 'nv-repeat' ];
    if (blackListAttr.indexOf(attribute.type) !== -1)  return;
    switch (attribute.name) {
      case 'nv-html':
        vnode.nativeElement.innerHTML = '';
        break;
      case 'nv-model':
        vnode.value = null;
        break;
      case 'nv-key':
        vnode.key = null;
        break;
      case 'nv-class':
        let className = vnode.nativeElement.className;
        className = className.replace(/\s$/, '');
        const space = className && String(attribute.value) ? ' ' : '';
        vnode.nativeElement.className = className + space + attribute.value;
        break;
      default:
        const attrName = attribute.name.replace('nv-', '');
        (vnode.nativeElement as Element).removeAttribute(attrName);
    }
  }
  
  public removeAttribute(vnode: Vnode, attribute: TAttributes): void {
    (vnode.nativeElement as Element).removeAttribute(attribute.name);
  }
  
  public setNodeValue(vnode: Vnode, nodeValue: any): void {
    vnode.nativeElement.nodeValue = nodeValue;
  }
  
  public setValue(vnode: Vnode, value: any): void {
    vnode.nativeElement.value = value;
  }
  
  public removeEventListener(vnode: Vnode, eventType: string, handler: any): void {
    vnode.nativeElement.removeEventListener(eventType, handler);
  }
  
  public addEventListener(vnode: Vnode, eventType: string, handler: any): void {
    vnode.nativeElement.addEventListener(eventType, handler);
  }
}

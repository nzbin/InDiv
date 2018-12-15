import { Vnode, TAttributes } from './parse-tag';

export function removeChild(parentVnode: Vnode, childVnode: Vnode): void {
  parentVnode.nativeElement.removeChild(childVnode.nativeElement);
}

export function appendChild(parentVnode: Vnode, childVnode: Vnode): void {
  parentVnode.nativeElement.appendChild(childVnode.nativeElement);
}

export function insertBefore(parentVnode: Vnode, childVnode: Vnode, index: number): void {
  parentVnode.nativeElement.insertBefore(childVnode.nativeElement, parentVnode.childNodes[index].nativeElement);
}

export function isContainted(parentVnode: Vnode, childVnode: Vnode): boolean {
  return parentVnode.nativeElement.contains(childVnode.nativeElement);
}

export function createNativeElementAndChildrens(createdVnode: Vnode, index?: number): any {
  const nativeElement = createNativeElement(createdVnode);
  createdVnode.nativeElement = nativeElement;
  if (createdVnode.attributes && createdVnode.attributes.length > 0) {
    createdVnode.attributes.forEach(attr => setAttributesToNativeElement(createdVnode, attr));
  }
  if (createdVnode.eventTypes && createdVnode.eventTypes.length > 0) {
    createdVnode.eventTypes.forEach(eventType => addEventListener(createdVnode, eventType.type, eventType.handler));
  }
  if (createdVnode.childNodes && createdVnode.childNodes.length > 0) {
    createdVnode.childNodes.forEach(childNode => createNativeElementAndChildrens(childNode));
  }
  if (createdVnode.value) setValue(createdVnode, createdVnode.value);
  if (!index) appendChild(createdVnode.parentVnode, createdVnode);
  else insertBefore(createdVnode.parentVnode, createdVnode, index);
}

export function createNativeElement(createdVnode: Vnode): any {
  if (createdVnode.type === 'text') return creatTextElement(createdVnode);
  if (createdVnode.type !== 'text') return creatElement(createdVnode);
}

export function creatElement(createdVnode: Vnode): any {
  return document.createElement(createdVnode.tagName.toLocaleUpperCase());
}

export function creatTextElement(createdVnode: Vnode): any {
  return document.createTextNode(createdVnode.nodeValue);
}



export function setAttributesToNativeElement(vnode: Vnode, attribute: TAttributes): void {
  if (attribute.type === 'nv-attribute' || attribute.type === 'prop' ||  attribute.type === 'directive') setNvAttribute(vnode, attribute);
  if (attribute.type === 'attribute') setAttribute(vnode, attribute);
}

export function setNvAttribute(vnode: Vnode, attribute: TAttributes): void {
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
      const space = className && String(attribute.value) ? ' ' : '';
      vnode.nativeElement.className = className + space + attribute.value;
      break;
    default:
      const attrName = attribute.name.replace('nv-', '');
      vnode.nativeElement[attrName] = attribute.nvValue;
  }
}

export function setAttribute(vnode: Vnode, attribute: TAttributes): void {
  (vnode.nativeElement as Element).setAttribute(attribute.name, attribute.value);
}

export function removeAttributesToNativeElement(vnode: Vnode, attribute: TAttributes): void {
  if (attribute.type === 'nv-attribute' || attribute.type === 'prop' ||  attribute.type === 'directive') removeNvAttribute(vnode, attribute);
  if (attribute.type === 'attribute') removeAttribute(vnode, attribute);
}

export function removeNvAttribute(vnode: Vnode, attribute: TAttributes): void {
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

export function removeAttribute(vnode: Vnode, attribute: TAttributes): void {
  (vnode.nativeElement as Element).removeAttribute(attribute.name);
}

export function setNodeValue(vnode: Vnode, nodeValue: any): void {
  vnode.nativeElement.nodeValue = nodeValue;
}

export function setValue(vnode: Vnode, value: any): void {
  vnode.nativeElement.value = value;
}

export function removeEventListener(vnode: Vnode, eventType: string, handler: any): void {
  vnode.nativeElement.removeEventListener(eventType, handler);
}

export function addEventListener(vnode: Vnode, eventType: string, handler: any): void {
  vnode.nativeElement.addEventListener(eventType, handler);
}

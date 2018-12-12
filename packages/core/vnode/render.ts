import { Vnode, TAttributes } from './parse-tag';

export function removeNativeElementChild(parentVnode: Vnode, childVnode: Vnode): void {
  parentVnode.nativeElement.removeChild(childVnode.nativeElement);
}

export function appendNativeElementChild(parentVnode: Vnode, childVnode: Vnode): void {
  parentVnode.nativeElement.appendChild(childVnode.nativeElement);
}

export function insertNativeElementChildBefore(parentVnode: Vnode, childVnode: Vnode, index: number): void {
  parentVnode.nativeElement.insertBefore(childVnode.nativeElement, parentVnode.childNodes[index].nativeElement);
}

export function isContaintedNativeElement(parentVnode: Vnode, childVnode: Vnode): boolean {
  return parentVnode.nativeElement.contains(childVnode.nativeElement);
}

export function createFullNativeElement(createdVnode: Vnode): any {
  // document.createElement;
}

export function setAttributesToNativeElement(vnode: Vnode, attribute: TAttributes): void {
  if (attribute.type === 'nv-attribute')  handleNvAttribute(vnode, attribute);
  if (attribute.type === 'attribute')  handleAttribute(vnode, attribute);
}

export function handleNvAttribute(vnode: Vnode, attribute: TAttributes): void {
  const blackListAttr = [ 'nv-if', 'nv-model', 'nv-key', 'nv-repeat' ];
  if (blackListAttr.indexOf(attribute.type) !== -1)  return;
  switch (attribute.name) {
    case 'nv-text':
      if (vnode.tagName === 'input') vnode.nativeElement.value = attribute.nvValue;
      else vnode.nativeElement.innerHTML = typeof attribute.nvValue === 'undefined' ? '' : attribute.nvValue;
      break;
    case 'nv-html':
      vnode.nativeElement.innerHTML = typeof attribute.nvValue === 'undefined' ? '' : attribute.nvValue;
      break;
    case 'nv-class':
      let className = vnode.nativeElement.className;
      className = className.replace(/\s$/, '');
      const space = className && String(attribute.value) ? ' ' : '';
      vnode.nativeElement.className = className + space + attribute.value;
      break;
    default:
      const attrName = attribute.name.replace('nv-', '');
      vnode.nativeElement.attrName = attribute.nvValue;
  }
}

export function handleAttribute(vnode: Vnode, attribute: TAttributes): void {
  (vnode.nativeElement as Element).setAttribute(attribute.name, attribute.value);
}

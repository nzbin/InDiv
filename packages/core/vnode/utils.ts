import { Vnode } from './vnode';
import { IComponent } from '../types';
import { utils } from '../utils';

/**
 * judge attribute is nv directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export function isDirective(type: string): boolean {
  return type === 'nv-attribute';
}

/**
 * judge attribute is nv directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export function isPropOrNvDirective(type: string): boolean {
  return type === 'directive' || type === 'prop';
}

/**
 * judge attribute is nv event directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export function isEventDirective(type: string): boolean {
  return type === 'nv-event';
}

/**
 * judge DOM is a element node or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export function isElementNode(vnode: Vnode): boolean {
  return vnode.type === 'tag' || vnode.type === 'component';
}

/**
 * judge DOM is nv-repeat dom or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export function isRepeatNode(vnode: Vnode): boolean {
  const nodeAttrs = vnode.attributes;
  let result = false;
  if (nodeAttrs) {
    nodeAttrs.forEach(attr => {
      if (attr.name === 'nv-repeat') result = true;
    });
  }
  return result;
}

/**
 * judge DOM is text node or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export function isTextNode(vnode: Vnode): boolean {
  return vnode.type === 'text';
}

/**
 * clone Node and clone it event
 *
 * event by attribute in DOM: eventTypes
 * repeat data by attribute in DOM: repeatData
 * isComponent: clone Component need add isComponent=true
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {Node}
 */
export function cloneVnode(vnode: Vnode, repeatData?: any): Vnode {
  const newVnode = new Vnode(vnode);
  newVnode.repeatData = { ...repeatData };
  copyRepeatData(newVnode, repeatData);
  copyParentVnode(newVnode);
  return newVnode;
}

/**
 * copy parentVnode from parentVnode to children
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {void}
 */
export function copyParentVnode(vnode: Vnode): void {
  if (!vnode.childNodes || vnode.childNodes.length === 0) return;
  vnode.childNodes.forEach(child => {
    child.parentVnode = vnode;
    copyParentVnode(child);
  });
}

/**
 * copy repeatData from parentVnode to children
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {void}
 */
export function copyRepeatData(vnode: Vnode, repeatData?: any): void {
  if (!vnode.childNodes || vnode.childNodes.length === 0) return;
  vnode.childNodes.forEach(child => {
    child.repeatData = { ...child.repeatData, ...repeatData };
    copyRepeatData(child, repeatData);
  });
}

/**
 * find exp is member of vm instance
 *
 * @param {*} vm
 * @param {string} exp
 * @returns {boolean}
 */
export function isFromVM(vm: any, exp: string): boolean {
  if (!vm) return false;
  const value = exp.replace(/\(.*\)/, '').split('.')[0];
  return value in vm;
}

/**
 * build props
 *
 * @param {*} prop
 * @param {IComponent} vm
 * @returns {*}
 * @memberof CompileUtil
 */
export function buildProps(prop: any, vm: IComponent): any {
  if (utils.isFunction(prop)) return prop.bind(vm);
  else return utils.deepClone(prop);
}

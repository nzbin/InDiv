import { Vnode } from './vnode';

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
 * test tagName
 *
 * @export
 * @param {Vnode} vnode
 * @param {string} tagName
 * @returns {boolean}
 */
export function isTagName(vnode: Vnode, tagName: string): boolean {
  if (vnode.tagName === tagName) return true;
  else return false;
}

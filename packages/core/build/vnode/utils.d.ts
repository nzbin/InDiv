import { Vnode } from './vnode';
/**
 * judge attribute is nv directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export declare function isDirective(type: string): boolean;
/**
 * judge attribute is nv directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export declare function isPropOrNvDirective(type: string): boolean;
/**
 * judge attribute is nv event directive or not
 *
 * @param {string} type
 * @returns {boolean}
 */
export declare function isEventDirective(type: string): boolean;
/**
 * judge DOM is a element node or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export declare function isElementNode(vnode: Vnode): boolean;
/**
 * judge DOM is nv-repeat dom or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export declare function isRepeatNode(vnode: Vnode): boolean;
/**
 * judge DOM is text node or not
 *
 * @param {Vnode} vnode
 * @returns {boolean}
 */
export declare function isTextNode(vnode: Vnode): boolean;

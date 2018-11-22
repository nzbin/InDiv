import { Vnode, IPatchList } from './parse';
/**
 * diff two Vnode
 *
 * if needDiffChildCallback return false, then stop diff childNodes
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
export declare function diffVnode(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[], needDiffChildCallback?: (oldVnode: Vnode, newVnode: Vnode) => boolean): void;

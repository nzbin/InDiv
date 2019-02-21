import { Vnode, IPatchList } from './vnode';
/**
 * diff two Vnode
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
export declare function diffVnode(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void;

import { IVnode, IPatchList } from '../../types';
/**
 * diff two Vnode
 *
 * if needDiffChildCallback return false, then stop diff childNodes
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: IVnode, newVnode: IVnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
export default function diffVnode(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[], needDiffChildCallback?: (oldVnode: IVnode, newVnode: IVnode) => boolean): void;

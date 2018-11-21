import { IVnode } from '../../types';
/**
 * parse node to VNode
 *
 * @export
 * @param {(DocumentFragment | Element)} node
 * @param {((node: DocumentFragment | Element) => string[])} [shouldDiffAttributes]
 * @returns {IVnode}
 */
export declare function parseToVnode(node: DocumentFragment | Element, shouldDiffAttributes?: (node: DocumentFragment | Element) => string[]): IVnode;

import { Vnode } from './vnode';
/**
 * parse a tag and return a Vnode
 *
 * @export
 * @param {string} tag
 * @param {string[]} directives
 * @returns {Vnode}
 */
export declare function parseTag(tag: string, directives: string[]): Vnode;

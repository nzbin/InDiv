import { parseTemplateToVnode, Vnode } from '@indiv/core';

/**
 * compile template to vnode
 *
 * @export
 * @param {string} content
 * @param {{
 *   components: string[],
 *   directives: string[],
 * }} parseVnodeOptions
 * @returns {Vnode[]}
 */
export function templateCompiler(content: string, parseVnodeOptions: {
  components: string[],
  directives: string[],
}): Vnode[] {
  return parseTemplateToVnode(content, parseVnodeOptions);
}

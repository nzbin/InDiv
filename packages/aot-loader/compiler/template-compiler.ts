import { parseTemplateToVnode, Vnode } from '@indiv/core';

export function templateCompiler(content: string, parseVnodeOptions: {
  components: string[],
  directives: string[],
}): Vnode[] {
  return parseTemplateToVnode(content, parseVnodeOptions);
}

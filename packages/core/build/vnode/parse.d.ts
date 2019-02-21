import { Vnode } from './vnode';
export declare type ParseOptions = {
    components: string[];
    directives: string[];
};
/**
 * vnode main method, parse a template HTML string to Vnode[]
 *
 * @export
 * @param {string} template
 * @param {ParseOptions} [options={ components: [], directives: [] }]
 * @returns {Vnode[]}
 */
export declare function parseTemplateToVnode(template: string, options?: ParseOptions): Vnode[];

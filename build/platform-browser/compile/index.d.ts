import { IVnode } from '../../types';
import { Utils } from '../../utils';
export { CompileUtil, CompileUtilForRepeat } from './utils';
/**
 * main compiler
 *
 * @class Compile
 */
export declare class Compile {
    utils: Utils;
    $vm: any;
    $el: Element;
    $fragment: DocumentFragment;
    /**
     * Creates an instance of Compile.
     * @param {(string | Element)} el
     * @param {*} vm
     * @memberof Compile
     */
    constructor(el: string | Element, vm: any);
    /**
     * needDiffChildCallback for Virtual DOM diff
     *
     * if newVnode.node.isComponent no need diff children
     * if newVnode.tagName and oldVnode.tagName no need diff children
     *
     * @param {IVnode} oldVnode
     * @param {IVnode} newVnode
     * @returns {boolean}
     * @memberof Compile
     */
    needDiffChildCallback(oldVnode: IVnode, newVnode: IVnode): boolean;
    /**
     * init compile
     *
     * @memberof Compile
     */
    init(): void;
    /**
     * compile element
     *
     * @param {DocumentFragment} fragment
     * @memberof Compile
     */
    compileElement(fragment: DocumentFragment): void;
    /**
     * recursive DOM for New State
     *
     * @param {(NodeListOf<Node & ChildNode>)} childNodes
     * @param {(DocumentFragment | Element)} fragment
     * @memberof Compile
     */
    recursiveDOM(childNodes: NodeListOf<Node & ChildNode>, fragment: DocumentFragment | Element): void;
    /**
     * compile string to DOM
     *
     * @param {Element} node
     * @param {(DocumentFragment | Element)} fragment
     * @memberof Compile
     */
    compile(node: Element, fragment: DocumentFragment | Element): void;
    /**
     * create document fragment
     *
     * @returns {DocumentFragment}
     * @memberof Compile
     */
    node2Fragment(): DocumentFragment;
    /**
     * compile text and use CompileUtil templateUpdater
     *
     * @param {Element} node
     * @param {string} exp
     * @memberof Compile
     */
    compileText(node: Element, exp: string): void;
    /**
     * judge attribute is nv directive or not
     *
     * @param {string} attr
     * @returns {boolean}
     * @memberof Compile
     */
    isDirective(attr: string): boolean;
    /**
     * judge attribute is nv event directive or not
     *
     * @param {string} eventName
     * @returns {boolean}
     * @memberof Compile
     */
    isEventDirective(eventName: string): boolean;
    /**
     * judge DOM is a element node or not
     *
     * @param {(Element | string)} node
     * @returns {boolean}
     * @memberof Compile
     */
    isElementNode(node: Element | string): boolean;
    /**
     * judge DOM is nv-repeat dom or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof Compile
     */
    isRepeatNode(node: Element): boolean;
    /**
     * judge DOM is text node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof Compile
     */
    isTextNode(node: Element): boolean;
}

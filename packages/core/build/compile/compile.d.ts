import { Vnode, ParseOptions } from '../vnode';
import { IComponent } from '../types';
/**
 * main compiler
 *
 * @class Compile
 */
export declare class Compile {
    componentInstance: IComponent;
    mountedElement: any;
    fragment: Vnode[];
    saveVnode: Vnode[];
    parseVnodeOptions: ParseOptions;
    /**
     * Creates an instance of Compile.
     * @param {any} el
     * @param {*} componentInstance
     * @memberof Compile
     */
    constructor(el: any, componentInstance: IComponent);
    /**
     * start compile and change saveVnode
     *
     * will return the newest vnode[]
     *
     * @returns {Vnode[]}
     * @memberof Compile
     */
    startCompile(): Vnode[];
    /**
     * compile vnode
     *
     * @memberof Compile
     */
    compileVnode(vnodes: Vnode[]): void;
    /**
     * recursive DOM for New State
     *
     * @param {Vnode[]} vnodes
     * @param {Vnode[]} fragment
     * @param {Vnode} parent
     * @memberof Compile
     */
    recursiveDOM(vnodes: Vnode[], fragment: Vnode[], parent: Vnode): void;
    /**
     * compile string to DOM
     *
     * @param {Vnode} vnode
     * @param {Vnode[]} fragment
     * @memberof Compile
     */
    compile(vnode: Vnode, fragment: Vnode[]): void;
    /**
     * compile text and use CompileUtil templateUpdater
     *
     * @param {Vnode} vnode
     * @param {string} exp
     * @memberof Compile
     */
    compileText(vnode: Vnode, exp: string): void;
}
